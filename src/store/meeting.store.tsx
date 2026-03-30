import { create } from "zustand";
import { socket } from "./socket.io";
import axios from "axios";
import { useCouncilSetupStore } from "./council-setup.store";
import { toast } from "sonner";

interface MeetingState {
  startMeeting: (agentIds: string[]) => Promise<boolean>;
  checkActiveMeeting: () => Promise<boolean>;
  endMeeting: () => Promise<void>;
  isMeetingActive: boolean;
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  startMeeting: async (agentIds: string[]) => {
    const { setShowCouncilOverview, setIsMeetingStarted } =
      useCouncilSetupStore.getState();
    // console.log(agentIds);
    // const { isMeetingActive } = get();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/agents/start-meeting`,
        { agentIds: agentIds, status: "active" },
      );

      console.log(data);
      if (data.success) {
        set({ isMeetingActive: true });

        console.log(data);

        // Use status from response if available, fallback to "active"
        const finalStatus = data.meeting?.status || data.status || "active";
        setIsMeetingStarted(finalStatus === "active");

        console.log("Meeting started:", finalStatus);

        if (!socket.connected) {
          socket.connect();
        }

        socket.emit("start_meeting");
        setShowCouncilOverview(false);
        return true;
      }
      return false;
    } catch (error: any) {
      console.log(error);
      console.error("Failed to start meeting:", error.response?.data?.detail);
      toast.error(error.response?.data?.detail || "Failed to start meeting");
      return false;
    }
  },
  checkActiveMeeting: async () => {
    const { setIsMeetingStarted } = useCouncilSetupStore.getState();
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/agents/check-active-meeting`,
      );
      // If server returns an active meeting, sync local state
      if (data.success) {
        set({ isMeetingActive: true });
        setIsMeetingStarted(true);
        if (!socket.connected) {
          socket.connect();
        }
        return true;
      } else {
        set({ isMeetingActive: false });
        setIsMeetingStarted(false);
        return false;
      }
    } catch (error) {
      console.error("Failed to check active meeting:", error);
      return false;
    }
  },
  endMeeting: async () => {
    const { isMeetingActive } = get();
    if (!isMeetingActive) return;
    set({ isMeetingActive: false });
    socket.emit("end_meeting");
    const { setIsMeetingStarted } = useCouncilSetupStore.getState();
    setIsMeetingStarted(false);
  },
  isMeetingActive: false,
}));
