import { create } from "zustand";
import { socket, useSocketStore } from "./socket.io";
import axios from "axios";
import { useCouncilSetupStore } from "./council-setup.store";
import { toast } from "sonner";

interface MeetingMessage {
  id: string;
  sender: string;
  text: string;
  displayedText: string; // progressively revealed as audio plays; equals text when done
  timestamp: number;
}

interface MeetingState {
  startMeeting: (agentIds: string[], userName?: string) => Promise<string | null>;
  checkActiveMeeting: () => Promise<boolean>;
  fetchMeetingDetails: (id: string) => Promise<boolean>;
  endMeeting: () => Promise<void>;
  deleteMeeting: (id: string) => Promise<boolean>;
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
  mutedAgents: Set<string>;
  setUserMessage: (msg: string) => void;
  setSpeakingAgent: (name: string | null) => void;
  setIsRecording: (val: boolean) => void;
  toggleMuteAgent: (agentId: string) => void;

  addMessage: (msg: MeetingMessage) => void;
  initSocketListeners: (mid: string) => void;
  setMeetingUrl: (url: string) => void;

  inviteModal: boolean;
  setInviteModal: (val: boolean) => void;
}

// ── Agent audio playback queue ────────────────────────────────────────────────
// Kept outside Zustand so it doesn't trigger re-renders.
const _audioQueue: {b64: string, sender: string}[] = [];
let _isPlaying = false;
let _currentSource: AudioBufferSourceNode | null = null;
let _currentCtx: AudioContext | null = null;
// Track active word-reveal intervals so we can cancel them on stop
const _revealIntervals: ReturnType<typeof setInterval>[] = [];

/** Immediately show full text for any messages still pending reveal. */
function _flushPendingTranscripts() {
  useMeetingStore.setState((state) => ({
    messages: state.messages.map((m) =>
      m.displayedText !== m.text ? { ...m, displayedText: m.text } : m
    ),
  }));
}

/** Stop any currently playing agent audio and clear the queue. */
function _stopAgentAudio() {
  _audioQueue.length = 0;
  _revealIntervals.forEach(clearInterval);
  _revealIntervals.length = 0;
  _flushPendingTranscripts();
  try { _currentSource?.stop(); } catch {}
  _currentSource = null;
  if (_currentCtx) { _currentCtx.close(); _currentCtx = null; }
  _isPlaying = false;
  useMeetingStore.getState().setSpeakingAgent(null);
}

/** Find the pending transcript message for a given sender (displayedText still empty). */
function _findPendingMessage(sender: string) {
  const { messages } = useMeetingStore.getState();
  return [...messages].reverse().find(
    (m) =>
      m.sender.trim().toLowerCase() === sender.trim().toLowerCase() &&
      m.displayedText === ""
  ) ?? null;
}

/** Reveal the text of a message word-by-word over `durationMs` milliseconds. */
function _startWordReveal(msgId: string, text: string, durationMs: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return;
  const msPerWord = Math.max(40, durationMs / words.length);
  let wordIndex = 0;

  const interval = setInterval(() => {
    wordIndex++;
    useMeetingStore.setState((state) => ({
      messages: state.messages.map((m) =>
        m.id === msgId
          ? { ...m, displayedText: words.slice(0, wordIndex).join(" ") }
          : m
      ),
    }));
    if (wordIndex >= words.length) {
      clearInterval(interval);
      const idx = _revealIntervals.indexOf(interval);
      if (idx !== -1) _revealIntervals.splice(idx, 1);
    }
  }, msPerWord);

  _revealIntervals.push(interval);
}

async function _playNextAudio() {
  if (_isPlaying || _audioQueue.length === 0) return;

  // Skip muted agents — also flush their transcript immediately
  const { mutedAgents } = useMeetingStore.getState();
  while (_audioQueue.length > 0) {
    const peek = _audioQueue[0];
    const participants: any[] = useMeetingStore.getState().participants;
    const participant = participants.find(
      (p: any) => p.name?.trim().toLowerCase() === peek.sender.trim().toLowerCase()
    );
    const agentId = participant?.id ?? peek.sender;
    if (!mutedAgents.has(agentId)) break;
    // Muted — discard audio but show transcript immediately
    const pending = _findPendingMessage(peek.sender);
    if (pending) {
      useMeetingStore.setState((state) => ({
        messages: state.messages.map((m) =>
          m.id === pending.id ? { ...m, displayedText: m.text } : m
        ),
      }));
    }
    _audioQueue.shift();
  }
  if (_audioQueue.length === 0) return;

  _isPlaying = true;
  const { b64, sender } = _audioQueue.shift()!;
  useMeetingStore.getState().setSpeakingAgent(sender);

  // Grab the pending transcript message before audio starts
  const pendingMsg = _findPendingMessage(sender);

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

    // Start word-by-word reveal synced to audio duration
    if (pendingMsg) {
      _startWordReveal(pendingMsg.id, pendingMsg.text, decoded.duration * 1000);
    }

    source.onended = () => {
      // Ensure full text is visible once audio finishes
      if (pendingMsg) {
        useMeetingStore.setState((state) => ({
          messages: state.messages.map((m) =>
            m.id === pendingMsg.id ? { ...m, displayedText: m.text } : m
          ),
        }));
      }
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
    // On error, reveal text immediately so it's not stuck hidden
    if (pendingMsg) {
      useMeetingStore.setState((state) => ({
        messages: state.messages.map((m) =>
          m.id === pendingMsg.id ? { ...m, displayedText: m.text } : m
        ),
      }));
    }
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
  inviteModal: false,
  setInviteModal: (val: boolean) => set({ inviteModal: val }),
  meetingId: null,
  meetingUrl: null,
  messages: [],
  participants: [],
  userMessage: "",
  isMeetingActive: false,
  isRecording: false,
  isProcessing: false,
  speakingAgent: null,
  mutedAgents: new Set<string>(),

  setMeetingUrl: (url) => set({ meetingUrl: url }),
  setUserMessage: (msg) => set({ userMessage: msg }),
  setSpeakingAgent: (name) => set({ speakingAgent: name }),
  setIsRecording: (val) => set({ isRecording: val }),
  stopAgentAudio: () => _stopAgentAudio(),

  toggleMuteAgent: (agentId) => {
    const { meetingId, mutedAgents } = get();
    const next = new Set(mutedAgents);
    const isMuting = !next.has(agentId);
    if (isMuting) {
      next.add(agentId);
    } else {
      next.delete(agentId);
    }
    set({ mutedAgents: next });
    // Notify the server so it can skip TTS for this agent
    if (meetingId) {
      socket.emit(isMuting ? "mute_agent" : "unmute_agent", {
        meeting_id: meetingId,
        agent_id: agentId,
      });
    }
    // If we just muted the currently speaking agent, stop their audio
    if (isMuting) {
      const { speakingAgent, participants } = get();
      if (speakingAgent) {
        const participant = (participants as any[]).find(
          (p) => p.name?.trim().toLowerCase() === speakingAgent.trim().toLowerCase()
        );
        if (participant?.id === agentId || participant == null && speakingAgent === agentId) {
          _stopAgentAudio();
        }
      }
    }
  },

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
    socket.off("connect");

    // Re-join the room on every (re)connection so responses reach the client
    // after a socket disconnect/reconnect cycle.
    socket.on("connect", () => {
      useSocketStore.getState().setIsConnected(true);
      socket.emit("join_meeting", { meeting_id: mid });
    });

    // Spec: Connect Socket.IO and EMIT join_meeting.
    socket.emit("join_meeting", { meeting_id: mid });

    socket.on("chat_update", (data: { sender: string; text: string }) => {
      const isAgent = data.sender !== "You" && data.sender !== "System";
      const msgId = crypto.randomUUID();
      get().addMessage({
        id: msgId,
        sender: data.sender || "System",
        text: data.text,
        // Agent messages start hidden and are revealed word-by-word as audio plays.
        // User/system messages show immediately.
        displayedText: isAgent ? "" : data.text,
        timestamp: Date.now(),
      });

      // Fallback: if TTS audio never arrives (e.g., network error), reveal after 5s
      if (isAgent) {
        setTimeout(() => {
          useMeetingStore.setState((state) => ({
            messages: state.messages.map((m) =>
              m.id === msgId && m.displayedText === ""
                ? { ...m, displayedText: m.text }
                : m
            ),
          }));
        }, 5000);
      }
    });

    socket.on("agent_typing", (data: { typing: boolean }) => {
      set({ isProcessing: data.typing });
    });

    socket.on("system_message", (data: { text: string; agents?: string[] }) => {
      get().addMessage({
        id: crypto.randomUUID(),
        sender: "System",
        text: data.text,
        displayedText: data.text,
        timestamp: Date.now(),
      });
    });

    socket.on("meeting_ended", () => {
      _stopAgentAudio(); // stop audio and flush any pending transcripts
      set({ isMeetingActive: false, meetingId: null });
      const { setIsMeetingStarted } = useCouncilSetupStore.getState();
      setIsMeetingStarted(false);
    });

    socket.on("agent_audio", (data: { sender: string; audio: string }) => {
      if (data.audio) _enqueueAudio(data.audio, data.sender);
    });
  },

  startMeeting: async (agentIds: string[], userName?: string) => {
    const { setShowCouncilOverview, setIsMeetingStarted } =
      useCouncilSetupStore.getState();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/agents/start-meeting`,
        { agentIds, status: "active", userName },
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
      speakingAgent: null,
      mutedAgents: new Set<string>(),
    });
    
    socket.emit("end_meeting", { meetingId });
    const { setIsMeetingStarted } = useCouncilSetupStore.getState();
    setIsMeetingStarted(false);
  },
  deleteMeeting: async (id: string) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_API_URL}/agents/delete-meeting/${id}`
      );
      if (data.success) {
        toast.success("Meeting deleted successfully");
        const { meetingId } = get();
        if (meetingId === id) {
          get().endMeeting();
        }
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Failed to delete meeting:", error.response?.data?.detail);
      toast.error(error.response?.data?.detail || "Failed to delete meeting");
      return false;
    }
  },
}));
