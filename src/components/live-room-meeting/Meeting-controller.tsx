import { useRef } from "react";
import { useMeetingStore } from "@/store/meeting.store";
import { Mic, MicOff, Phone, Share, Video, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { useNavigate } from "react-router-dom";
import { socket } from "@/store/socket.io";

export const MeetingController = () => {
  const {
    userMessage,
    setUserMessage,
    sendMessage,
    sendAudio,
    stopAgentAudio,
    endMeeting,
    meetingId,
    isProcessing,
  } = useMeetingStore();

  const navigate = useNavigate();

  /** Tell the server to pause the autonomous loop. */
  const notifyTyping = () => {
    if (meetingId) socket.emit("user_typing", { meeting_id: meetingId });
  };

  // While the user is speaking, keep sending user_typing every 800ms so the
  // autonomous agent loop stays paused for the whole duration of their turn.
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTypingHeartbeat = () => {
    if (typingIntervalRef.current) return; // already running
    notifyTyping();
    typingIntervalRef.current = setInterval(notifyTyping, 800);
  };

  const stopTypingHeartbeat = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  };

  const { isActive, isSpeaking, startListening, stopListening } =
    useVoiceRecorder({
      onAudioReady: (blob) => {
        stopTypingHeartbeat(); // user finished speaking — let agents respond
        sendAudio(blob);
      },
      onSpeechStart: () => {
        stopAgentAudio();        // cut agent audio the moment the user speaks
        startTypingHeartbeat();  // keep the autonomous loop paused until they're done
      },
      silenceThreshold: 0.05,
      silenceDuration: 2500,   // wait 2.5s of silence before treating speech as done
    });

  const handleSend = () => {
    if (userMessage.trim()) sendMessage(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend();
  };

  const handleMicClick = () => {
    if (isActive) {
      stopTypingHeartbeat();
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <main className="flex flex-col items-center gap-2 mt-5 mx-auto w-full max-w-lg px-4">
      {/* Status indicator */}
      {isActive && (
        <div className="flex items-center gap-2 text-xs">
          {isSpeaking ? (
            <>
              <span className="h-2 w-2 rounded-full bg-[#B6FF3B] animate-ping inline-block" />
              <span className="text-[#B6FF3B]">Speaking...</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-white/30 inline-block" />
              <span className="text-white/40">Listening for your voice...</span>
            </>
          )}
        </div>
      )}

      {/* Text input */}
      <div className="glass w-full flex items-center px-4 py-2 rounded-full border border-white/10 group focus-within:border-[#B6FF3B]/30 transition-all duration-300">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => {
            // Cancel agent autonomous loop the moment the user starts typing
            if (e.target.value && !userMessage) notifyTyping();
            setUserMessage(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Transmit a message to the council..."
          className="flex-1 bg-transparent text-xs text-white placeholder:text-gray-500 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className={cn(
            "p-1.5 rounded-full transition-all duration-300",
            userMessage.trim()
              ? "bg-[#B6FF3B] text-[#0D1117] cursor-pointer"
              : "bg-white/5 text-gray-600 cursor-not-allowed",
          )}
        >
          <Send className="size-3" />
        </button>
      </div>

      {/* Meeting controls */}
      <div className="glass p-2 md:p-4 md:rounded-full rounded-full w-full md:w-[350px] h-[70px] flex justify-between items-center gap-3 bg-black/40 backdrop-blur-xl">
        <section className="flex items-center justify-between gap-3">
          <div>
            <Button className="glass rounded-full h-9 w-9" disabled>
              <Video />
            </Button>
            <p className="text-[7px] uppercase mt-1 text-white text-center">
              Video
            </p>
          </div>

          <div>
            <Button
              onClick={handleMicClick}
              disabled={isProcessing}
              className={cn(
                "rounded-full h-9 w-9 transition-all duration-300",
                isActive && isSpeaking
                  ? "bg-[#B6FF3B] text-[#0D1117] shadow-[0_0_14px_#B6FF3B90] scale-105"
                  : isActive
                    ? "bg-white/10 text-white ring-1 ring-[#B6FF3B]/40"
                    : "glass",
              )}
            >
              {isActive ? (
                <MicOff className="size-4" />
              ) : (
                <Mic className="size-4" />
              )}
            </Button>
            <p className="text-[7px] uppercase mt-1 text-white text-center">
              {isActive ? (isSpeaking ? "Speaking" : "Open") : "Speak"}
            </p>
          </div>

          <div>
            <Button className="glass rounded-full h-9 w-9" disabled>
              <Share />
            </Button>
            <p className="text-[7px] uppercase mt-1 text-white text-center">
              Share
            </p>
          </div>
        </section>

        <div className="h-10 w-0.5 bg-gray-600 hidden md:block" />

        <section className="w-full">
          <Button
            onClick={() => {
              stopTypingHeartbeat();
              stopListening();
              endMeeting();

              setTimeout(() => {
                navigate("/council-setup");
              }, 1000);
            }}
            className="bg-red-500 text-white font-bold hover:bg-red-600 cursor-pointer h-10 rounded-full w-full"
          >
            <Phone className="size-4" /> End
          </Button>

          {/* <Button
            onClick={async () => {
              if (meetingId) {
                stopTypingHeartbeat();
                stopListening();
                await deleteMeeting(meetingId);
                navigate("/council-setup");
              }
            }}
            className="bg-red-900 border border-red-500 text-white font-bold hover:bg-red-800 cursor-pointer h-10 w-10 p-0 rounded-full flex items-center justify-center"
            title="Delete Meeting"
          >
            <Trash2 className="size-4" />
          </Button> */}
        </section>
      </div>
    </main>
  );
};
