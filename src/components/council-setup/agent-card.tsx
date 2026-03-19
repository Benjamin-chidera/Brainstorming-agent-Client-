import { useState } from "react";
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
import { SparklesIcon, Settings2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
 
interface AgentCardProps {
  agent: Agent;
}

export const AgentCard = ({ agent }: AgentCardProps) => {
  const { updateAgent, playAgentIntroduction, handleGenerateIntro } =
    useCouncilSetupStore();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

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
        <Card className="absolute inset-0 backface-hidden glass flex flex-col h-full border-white/10 group-hover:border-[#7F0DF2]/30 transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <div className="relative">
                  {agent.avatarUrl ? (
                    <div className="size-10 rounded-full border-2 border-[#7F0DF2]/30 overflow-hidden shadow-lg shadow-[#7F0DF2]/20 animate-[breathing_4s_ease-in-out_infinite]">
                      <img
                        src={agent.avatarUrl}
                        alt="Agent Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="size-10 rounded-full bg-[#7F0DF2]/10 flex items-center justify-center text-[#7F0DF2] text-xs font-black border border-[#7F0DF2]/20">
                      {agent.id.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <CardTitle className="text-sm font-bold text-white tracking-tight ml-1">
                  Draft Agent
                </CardTitle>
              </div>
              <SparklesIcon className="size-3 text-[#7F0DF2] opacity-50" />
            </div>
          </CardHeader>

          <CardContent className="space-y-5 flex-1 p-6 pt-0">
            <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
              <label className="text-[9px] font-bold text-gray-400 border-l-2 border-[#7F0DF2] pl-1.5 ml-0.5 uppercase tracking-tighter">
                Bio Configuration
              </label>
              <textarea
                value={agent.bio}
                onChange={(e) => updateAgent(agent.id, { bio: e.target.value })}
                placeholder="Give this agent a personality, role, and skills..."
                className="flex-1 min-h-[140px] bg-white/3 border border-white/5 rounded-md p-3 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:bg-white/5 focus:border-[#7F0DF2]/30 transition-all resize-none"
              />
            </div>
          </CardContent>

          <CardFooter className="pt-2 flex flex-col gap-3 p-6 mt-auto">
            <VoiceSettingsModal agent={agent} />
            <Button
              className="w-full h-12 bg-white text-black hover:bg-gray-200 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-white/5 group/btn"
              onClick={handleReview}
              disabled={isReviewing || !agent.bio}
            >
              {isReviewing ? (
                <Spinner className="size-5 border-black/30" />
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
          className="absolute inset-0 backface-hidden glass flex flex-col h-full border-[#7F0DF2]/50 rotate-y-180 bg-[#050505] shadow-[0_0_40px_rgba(127,13,242,0.15)] overflow-hidden cursor-pointer transition-all hover:border-[#7F0DF2]/80 group/back"
        >
          {/* Header: Scanning Indicator */}
          <CardHeader className="p-4 border-b border-white/5 bg-[#7F0DF2]/5">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono text-green-500/80 uppercase tracking-widest">
                  Agent Online
                </span>
              </div>
              <SparklesIcon className="size-3 text-[#7F0DF2]" />
            </div>
          </CardHeader>

          <CardContent className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-8">
            {/* Avatar with "Active" Ring */}
            <div className="relative">
              {/* Outer spinning ring for "talking" effect */}
              <div className="absolute -inset-4 rounded-full border border-[#7F0DF2]/20 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-0 rounded-full bg-[#7F0DF2]/20 blur-2xl animate-pulse" />

              <div className="relative size-28 rounded-full border-2 border-[#7F0DF2] p-1 shadow-[0_0_30px_rgba(127,13,242,0.4)]">
                <img
                  src={agent.avatarUrl || "/default-avatar.png"}
                  className="w-full h-full rounded-full object-cover"
                  alt={agent.name}
                />
              </div>
            </div>

            {/* The Intro Message: "Hello! I'm Ben..." */}
            <div className="w-full space-y-4">
              <div className="w-full h-px bg-linear-to-r from-transparent via-[#7F0DF2]/40 to-transparent" />

              <div className="max-h-[180px] overflow-y-auto px-2 custom-scrollbar">
                {/* We use agent.intro here which contains the "Hello! I'm Ben..." text */}
                <p className="text-sm text-gray-100 font-medium italic leading-relaxed tracking-wide">
                  "{agent.intro || "Initializing core personality..."}"
                </p>
              </div>

              <div className="w-full h-px bg-linear-to-r from-transparent via-[#7F0DF2]/40 to-transparent" />
            </div>
          </CardContent>

          {/* Footer: Action to go back or proceed */}
          <CardFooter className="p-4 bg-white/2 flex flex-col gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsFlipped(false)}
              className="w-full text-white/30 text-[9px] uppercase font-black tracking-[0.3em] hover:text-[#7F0DF2] hover:bg-[#7F0DF2]/10 transition-all"
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
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(127, 13, 242, 0.2); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(127, 13, 242, 0.4); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(127, 13, 242, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
