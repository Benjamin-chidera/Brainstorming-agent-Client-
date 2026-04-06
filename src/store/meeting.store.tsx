import { create } from "zustand";
import { socket } from "./socket.io";
import axios from "axios";
import { useCouncilSetupStore } from "./council-setup.store";
import { toast } from "sonner";

interface MeetingMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

interface MeetingState {
  startMeeting: (agentIds: string[]) => Promise<string | null>;
  checkActiveMeeting: () => Promise<boolean>;
  fetchMeetingDetails: (id: string) => Promise<boolean>;
  endMeeting: () => Promise<void>;
  sendMessage: (content: string) => void;
  live_meeting_api: () => Promise<any>;
  isMeetingActive: boolean;
  meetingId: string | null;
  meetingUrl: string | null;
  messages: MeetingMessage[];
  participants: any[];
  userMessage: string;
  isProcessing: boolean;
  setUserMessage: (msg: string) => void;
  addMessage: (msg: MeetingMessage) => void;
  initSocketListeners: (mid: string) => void;
  setMeetingUrl: (url: string) => void;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meetingId: null,
  meetingUrl: null,
  messages: [],
  participants: [],
  userMessage: "",
  isMeetingActive: false,
  isProcessing: false,

  setMeetingUrl: (url) => set({ meetingUrl: url }),

  setUserMessage: (msg) => set({ userMessage: msg }),

  sendMessage: (content) => {
    const { meetingId } = get();
    if (!meetingId || !content.trim()) return;

    // Optimistically add to local messages? Or wait for socket roundtrip?
    // Let's add it optimistically for better UX.
    // Optimistically add to local messages
    // To comply strictly with "Use chat_update to update your chat list", you can remove optimistic msg.
    // However, including it won't hurt if we manage IDs right.
    // Spec: user_message -> {"meeting_id": 123, "text": "Hello agents!"}
    socket.emit("user_message", {
      meeting_id: meetingId,
      text: content.trim(),
    });
    set({ userMessage: "" });
  },

  live_meeting_api: async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/agents/live-meeting`,
      );
      if (data.success) {
        // const mid = data.meeting_id || data.meeting?.id;
        // const murl =
        //   data.meeting_url ||
        //   `${window.location.protocol}//${window.location.host}/live-meeting-room/${mid}`;
        // set({ isMeetingActive: true, meetingId: mid, meetingUrl: murl });
        // const finalStatus = data.meeting?.status || data.status || "active";
        // setIsMeetingStarted(finalStatus === "active");
        // if (!socket.connected) {
        //   socket.connect();
        // }
        // get().initSocketListeners();
        // socket.emit("start_meeting", { meetingId: mid });
        // setShowCouncilOverview(false);
        // return mid;

        console.log(data);

        // send meesga to socket
        socket.emit("user_msg", {
          meetingId: data.meeting_id,
          content: data.message,
        });
      }
      return null;
    } catch (error: any) {
      console.error("Failed to start meeting:", error.response?.data?.detail);
      toast.error(error.response?.data?.detail || "Failed to start meeting");
      return null;
    }
  },

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  initSocketListeners: (mid) => {
    if (!socket.connected) {
      socket.connect();
    }

    // Remove any existing listeners to prevent duplicates (StrictMode / multiple calls)
    socket.off("chat_update");
    socket.off("agent_typing");
    socket.off("system_message");
    socket.off("meeting_ended");

    // Spec: Connect Socket.IO and EMIT join_meeting.
    socket.emit("join_meeting", { meeting_id: mid });

    socket.on("chat_update", (data: { sender: string; text: string }) => {
      get().addMessage({
        id: crypto.randomUUID(),
        sender: data.sender || "System",
        text: data.text,
        timestamp: Date.now(),
      });
    });

    socket.on("agent_typing", (data: { typing: boolean }) => {
      set({ isProcessing: data.typing });
    });

    socket.on("system_message", (data: { text: string; agents?: string[] }) => {
      get().addMessage({
        id: crypto.randomUUID(),
        sender: "System",
        text: data.text,
        timestamp: Date.now(),
      });
    });

    socket.on("meeting_ended", () => {
      set({ isMeetingActive: false, meetingId: null });
      const { setIsMeetingStarted } = useCouncilSetupStore.getState();
      setIsMeetingStarted(false);
    });
  },

  startMeeting: async (agentIds: string[]) => {
    const { setShowCouncilOverview, setIsMeetingStarted } =
      useCouncilSetupStore.getState();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/agents/start-meeting`,
        { agentIds: agentIds, status: "active" },
      );

      console.log("Start meeting response:", data);
      if (data.success) {
        const mid = data.meeting_id || data.meeting?.id;
        const murl =
          data.meeting_url ||
          `${window.location.protocol}//${window.location.host}/live-meeting-room/${mid}`;
        set({ isMeetingActive: true, meetingId: mid, meetingUrl: murl });

        const finalStatus = data.meeting?.status || data.status || "active";
        setIsMeetingStarted(finalStatus === "active");

        if (!socket.connected) {
          socket.connect();
        }

        get().initSocketListeners(mid);
        // socket.emit("start_meeting", { meetingId: mid });
        setShowCouncilOverview(false);
        return mid;
      }
      return null;
    } catch (error: any) {
      console.error("Failed to start meeting:", error.response?.data?.detail);
      toast.error(error.response?.data?.detail || "Failed to start meeting");
      return null;
    }
  },
  fetchMeetingDetails: async (id: string) => {
    const { setIsMeetingStarted } = useCouncilSetupStore.getState();
    try {
      // Load Room State: GET /api/v1/meeting/123
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/meeting/${id}`,
      );
      if (data.is_live ?? data.success) {
        const state = data.state || {};
        const mid = String(id);
        const murl =
          data.meeting_url ||
          `${window.location.protocol}//${window.location.host}/live-meeting-room/${mid}`;
        set({
          isMeetingActive: true,
          meetingId: mid,
          meetingUrl: murl,
          messages: state.messages || [],
          participants: state.participants || [],
        });
        setIsMeetingStarted(true);
        get().initSocketListeners(mid);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to load room state:", error);
      return false;
    }
  },

  checkActiveMeeting: async () => {
    const { setIsMeetingStarted } = useCouncilSetupStore.getState();
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/agents/check-active-meeting`,
      );
      if (data.success) {
        const mid = data.meeting_id || data.meeting?.id;
        return get().fetchMeetingDetails(mid);
      } else {
        set({ isMeetingActive: false, meetingId: null, meetingUrl: null });
        setIsMeetingStarted(false);
        return false;
      }
    } catch (error) {
      console.error("Failed to check active meeting:", error);
      return false;
    }
  },
  endMeeting: async () => {
    const { isMeetingActive, meetingId } = get();
    if (!isMeetingActive) return;
    set({ isMeetingActive: false, meetingId: null, meetingUrl: null });
    socket.emit("end_meeting", { meetingId });
    const { setIsMeetingStarted } = useCouncilSetupStore.getState();
    setIsMeetingStarted(false);
  },
}));
