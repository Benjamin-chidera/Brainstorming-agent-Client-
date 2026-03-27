import { useState, useCallback } from "react";
import type { Agent } from "@/store/council-setup.store";
import { useCouncilSetupStore } from "@/store/council-setup.store";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceSettingsModal } from "./voice-settings-modal";
import { SparklesIcon, Settings2Icon, Mic, MicOff, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { useSpeechToText } from "@/hooks/useSpeechToText";

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard = ({ agent }: AgentCardProps) => {
  const { updateAgent, playAgentIntroduction, handleGenerateIntro, updateAgentOnServer, deleteAgent, agents } =
    useCouncilSetupStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  // Speech-to-text: append transcribed speech to existing bio
  const handleSpeechResult = useCallback(
    (transcript: string) => {
      const currentBio = agent.bio || "";
      const separator = currentBio && !currentBio.endsWith(" ") ? " " : "";
      updateAgent(agent.id, { bio: currentBio + separator + transcript });
    },
    [agent.bio, agent.id, updateAgent]
  );

  const { isListening, isSupported, toggleListening, error: speechError } = useSpeechToText({
    onResult: handleSpeechResult,
  });

  const handleMicClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleListening();
  };

  const handleReview = async () => {
    if (isReviewing || !agent.bio) return;

    setIsReviewing(true);
    try {
      // 1. Ask the LLM to structure the intro based on the raw bio
      const structuredIntro = await handleGenerateIntro(agent.id);

      if (structuredIntro) {
        // 2. Flip the card and play the voice
        setIsFlipped(true);
        await playAgentIntroduction(agent, structuredIntro);
      }
    } catch (error) {
      console.error("Review failed:", error);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="perspective-1000 h-[480px] w-full group">
      <div
        className={cn(
          "relative w-full h-full transition-all duration-700 preserve-3d cursor-default",
          isFlipped ? "rotate-y-180" : "",
        )}
      >
        {/* FRONT SIDE */}
        <Card className="absolute inset-0 backface-hidden bg-[#161B22] flex flex-col h-full border-[#8B949E]/15 group-hover:border-[#B6FF3B]/30 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <div className="relative">
                  {agent.avatarUrl ? (
                    <div className="size-10 rounded-full border-2 border-[#B6FF3B]/30 overflow-hidden shadow-lg shadow-[#B6FF3B]/20 animate-[breathing_4s_ease-in-out_infinite]">
                      <img
                        src={agent.avatarUrl}
                        alt="Agent Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="size-10 rounded-full bg-[#B6FF3B]/10 flex items-center justify-center text-[#B6FF3B] text-xs font-black border border-[#B6FF3B]/20">
                      {agent.id.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <CardTitle className="text-sm font-bold text-white tracking-tight ml-1">
                  Draft Agent
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {!agent.isNew && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateAgentOnServer(agent.id);
                    }}
                    className="size-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#B6FF3B]/20 border border-transparent hover:border-[#B6FF3B]/40 cursor-pointer"
                    title="Update agent details"
                  >
                    <Save className="size-3 text-[#B6FF3B]" />
                  </button>
                )}
                {agents.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAgent(agent.id);
                    }}
                    className="size-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/20 border border-transparent hover:border-red-500/40 cursor-pointer"
                    title="Remove agent"
                  >
                    <Trash2 className="size-3 text-red-400" />
                  </button>
                )}
                <SparklesIcon className="size-3 text-[#B6FF3B] opacity-50" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-5 flex-1 p-6 pt-0">
            <div className="space-y-1.5 flex-1 flex flex-col min-h-0 relative">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold text-[#8B949E] border-l-2 border-[#B6FF3B] pl-1.5 ml-0.5 uppercase tracking-tighter">
                  Bio Configuration
                </label>
                {speechError && (
                  <span className="text-[8px] text-red-400 animate-pulse font-mono">
                    {speechError}
                  </span>
                )}
              </div>
              
              <textarea
                value={agent.bio}
                onChange={(e) =>
                  updateAgent(agent.id, { bio: e.target.value })
                }
                placeholder={
                  isListening
                    ? "Listening... speak now"
                    : speechError
                    ? "Mic error. Try typing instead."
                    : "Type or tap the mic to speak..."
                }
                className={cn(
                  "flex-1 min-h-[140px] w-full bg-white/3 border rounded-md p-3 pr-12 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:bg-white/5 transition-all resize-none",
                  isListening
                    ? "border-[#B6FF3B]/40 bg-[#B6FF3B]/5 shadow-[inset_0_0_20px_rgba(182,255,59,0.05)]"
                    : "border-white/5 focus:border-[#B6FF3B]/30"
                )}
              />

              {isSupported && (
                <button
                  onClick={handleMicClick}
                  type="button"
                  className={cn(
                    "absolute bottom-4 right-4 z-10 rounded-full p-2 transition-all duration-300 cursor-pointer outline-none",
                    isListening
                      ? "bg-red-500/20 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse"
                      : speechError
                      ? "bg-red-900/20 border border-red-500/20 opacity-50"
                      : "bg-white/10 border border-white/10 hover:bg-[#B6FF3B]/10 hover:border-[#B6FF3B]/30"
                  )}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? (
                    <MicOff className="size-4 text-red-400" />
                  ) : (
                    <Mic className="size-4 text-[#B6FF3B]" />
                  )}
                </button>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-2 flex flex-col gap-3 p-6 mt-auto">
            <VoiceSettingsModal agent={agent} />
            <Button
              className="w-full h-12 bg-[#B6FF3B] text-[#0D1117] hover:bg-[#B6FF3B]/90 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-[#B6FF3B]/10 group/btn"
              onClick={handleReview}
              disabled={isReviewing || !agent.bio}
            >
              {isReviewing ? (
                <Spinner className="size-5 border-[#0D1117]/30" />
              ) : (
                "Review Identity"
              )}
              <Settings2Icon className="size-3 ml-2 group-hover/btn:rotate-90 transition-transform" />
            </Button>
          </CardFooter>
        </Card>

        {/* BACK SIDE (LLM Result) */}
        <Card
          onClick={() => setIsFlipped(false)}
          className="absolute inset-0 backface-hidden flex flex-col h-full border-[#B6FF3B]/50 rotate-y-180 bg-[#0D1117] shadow-[0_0_40px_rgba(182,255,59,0.1)] overflow-hidden cursor-pointer transition-all hover:border-[#B6FF3B]/80 group/back"
        >
          {/* Header: Scanning Indicator */}
          <CardHeader className="p-4 border-b border-white/5 bg-[#B6FF3B]/5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-[#B6FF3B] animate-pulse" />
                <span className="text-[10px] font-mono text-[#B6FF3B]/80 uppercase tracking-widest">
                  Agent Online
                </span>
              </div>
              <SparklesIcon className="size-3 text-[#B6FF3B]" />
            </div>
          </CardHeader>

          <CardContent className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-8">
            {/* Avatar with "Active" Ring */}
            <div className="relative">
              {/* Outer spinning ring for "talking" effect */}
              <div className="absolute -inset-4 rounded-full border border-[#B6FF3B]/20 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-0 rounded-full bg-[#B6FF3B]/20 blur-2xl animate-pulse" />

              <div className="relative size-28 rounded-full border-2 border-[#B6FF3B] p-1 shadow-[0_0_30px_rgba(182,255,59,0.3)]">
                <img
                  src={agent.avatarUrl || "/default-avatar.png"}
                  className="w-full h-full rounded-full object-cover"
                  alt="Agent"
                />
              </div>
            </div>

            {/* The Intro Message: "Hello! I'm Ben..." */}
            <div className="w-full space-y-4">
              <div className="w-full h-px bg-linear-to-r from-transparent via-[#B6FF3B]/40 to-transparent" />

              <div className="max-h-[180px] overflow-y-auto px-2 custom-scrollbar">
                {/* We use agent.intro here which contains the "Hello! I'm Ben..." text */}
                <p className="text-sm text-gray-100 font-medium italic leading-relaxed tracking-wide">
                  "{agent.intro || "Initializing core personality..."}"
                </p>
              </div>

              <div className="w-full h-px bg-linear-to-r from-transparent via-[#B6FF3B]/40 to-transparent" />
            </div>
          </CardContent>

          {/* Footer: Action to go back or proceed */}
          <CardFooter className="p-4 bg-white/2 flex flex-col gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsFlipped(false)}
              className="w-full text-white/30 text-[9px] uppercase font-black tracking-[0.3em] hover:text-[#B6FF3B] hover:bg-[#B6FF3B]/10 transition-all"
            >
              &larr; Redefine Agent
            </Button>
          </CardFooter>
        </Card>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes breathing {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(182, 255, 59, 0.2); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(182, 255, 59, 0.4); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(182, 255, 59, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
