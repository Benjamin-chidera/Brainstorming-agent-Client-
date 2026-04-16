import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMeetingStore } from "@/store/meeting.store";

interface MuteBtnProps {
  agentId: string;
}

export const MuteBtn = ({ agentId }: MuteBtnProps) => {
  const { mutedAgents, toggleMuteAgent } = useMeetingStore();
  const isMuted = mutedAgents.has(agentId);

  return (
    <button
      id={`mute-btn-${agentId}`}
      onClick={() => toggleMuteAgent(agentId)}
      title={isMuted ? "Unmute agent" : "Mute agent"}
      className={cn(
        "relative flex items-center justify-center size-7 rounded-full border transition-all duration-300 cursor-pointer group/mute",
        isMuted
          ? "bg-red-500/20 border-red-500/60 hover:bg-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
      )}
    >
      {/* Glow ring when muted */}
      {isMuted && (
        <span className="absolute inset-0 rounded-full animate-ping bg-red-500/20 pointer-events-none" />
      )}

      {isMuted ? (
        <MicOff
          size={12}
          className="text-red-400 transition-transform duration-200 group-hover/mute:scale-110"
        />
      ) : (
        <Mic
          size={12}
          className="text-white/50 transition-transform duration-200 group-hover/mute:scale-110 group-hover/mute:text-white/80"
        />
      )}
    </button>
  );
};
