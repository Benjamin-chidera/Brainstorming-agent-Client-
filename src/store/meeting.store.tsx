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
  sendAudio: (blob: Blob) => void;
  stopAgentAudio: () => void;
  live_meeting_api: () => Promise<any>;
  isMeetingActive: boolean;
  isRecording: boolean;
  meetingId: string | null;
  meetingUrl: string | null;
  messages: MeetingMessage[];
  participants: any[];
  userMessage: string;
  isProcessing: boolean;
  speakingAgent: string | null;
  setUserMessage: (msg: string) => void;
  setSpeakingAgent: (name: string | null) => void;
  setIsRecording: (val: boolean) => void;

  addMessage: (msg: MeetingMessage) => void;
  initSocketListeners: (mid: string) => void;
  setMeetingUrl: (url: string) => void;
}

// ── Agent audio playback queue ────────────────────────────────────────────────
// Kept outside Zustand so it doesn't trigger re-renders.
const _audioQueue: {b64: string, sender: string}[] = [];
let _isPlaying = false;
let _currentSource: AudioBufferSourceNode | null = null;
let _currentCtx: AudioContext | null = null;

/** Stop any currently playing agent audio and clear the queue. */
function _stopAgentAudio() {
  _audioQueue.length = 0;
  try { _currentSource?.stop(); } catch {}
  _currentSource = null;
  if (_currentCtx) { _currentCtx.close(); _currentCtx = null; }
  _isPlaying = false;
  useMeetingStore.getState().setSpeakingAgent(null);
}

async function _playNextAudio() {
  if (_isPlaying || _audioQueue.length === 0) return;
  _isPlaying = true;
  const {b64, sender} = _audioQueue.shift()!;
  
  useMeetingStore.getState().setSpeakingAgent(sender);

  try {
    const bytes = atob(b64);
    const buf = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i);

    const ctx = new AudioContext();
    _currentCtx = ctx;
    const decoded = await ctx.decodeAudioData(buf.buffer);
    const source = ctx.createBufferSource();
    _currentSource = source;
    source.buffer = decoded;
    source.connect(ctx.destination);
    source.onended = () => {
      _isPlaying = false;
      _currentSource = null;
      useMeetingStore.getState().setSpeakingAgent(null);
      ctx.close();
      _currentCtx = null;
      _playNextAudio();
    };
    source.start();
  } catch (err) {
    console.error("[Audio] Playback error:", err);
    _isPlaying = false;
    _currentSource = null;
    useMeetingStore.getState().setSpeakingAgent(null);
    _currentCtx = null;
    _playNextAudio();
  }
}

function _enqueueAudio(b64: string, sender: string) {
  _audioQueue.push({b64, sender});
  _playNextAudio();
}
// ─────────────────────────────────────────────────────────────────────────────

export const useMeetingStore = create<MeetingState>((set, get) => ({
  meetingId: null,
  meetingUrl: null,
  messages: [],
  participants: [],
  userMessage: "",
  isMeetingActive: false,
  isRecording: false,
  isProcessing: false,
  speakingAgent: null,

  setMeetingUrl: (url) => set({ meetingUrl: url }),
  setUserMessage: (msg) => set({ userMessage: msg }),
  setSpeakingAgent: (name) => set({ speakingAgent: name }),
  setIsRecording: (val) => set({ isRecording: val }),
  stopAgentAudio: () => _stopAgentAudio(),

  sendAudio: (blob: Blob) => {
    const { meetingId } = get();
    if (!meetingId) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // Strip the data:audio/...;base64, prefix
      const b64 = dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
      socket.emit("user_audio", { meeting_id: meetingId, audio: b64 });
    };
    reader.readAsDataURL(blob);
  },

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
    socket.off("agent_audio");

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

    socket.on("agent_audio", (data: { sender: string; audio: string }) => {
      if (data.audio) _enqueueAudio(data.audio, data.sender);
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
    
    get().stopAgentAudio();
    
    set({ 
      isMeetingActive: false, 
      meetingId: null, 
      meetingUrl: null,
      messages: [],
      participants: [],
      userMessage: "",
      isProcessing: false,
      speakingAgent: null
    });
    
    socket.emit("end_meeting", { meetingId });
    const { setIsMeetingStarted } = useCouncilSetupStore.getState();
    setIsMeetingStarted(false);
  },
}));
