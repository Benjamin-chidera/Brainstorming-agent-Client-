import React, { useState } from "react";
import type { Agent } from "@/store/council-setup.store";
import { useCouncilSetupStore } from "@/store/council-setup.store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VoiceSettingsModal } from "./voice-settings-modal";
import { SparklesIcon, Settings2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard = ({ agent }: AgentCardProps) => {
  const { updateAgent } = useCouncilSetupStore();

  return (
    <Card className="glass flex flex-col h-full border-white/10 group transition-all duration-300 hover:border-[#7F0DF2]/30">
      <CardHeader className="pb-">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="relative">
              {agent.avatarUrl ? (
                <div className="size-10 rounded-full border-2 border-[#7F0DF2]/30 overflow-hidden shadow-lg shadow-[#7F0DF2]/20 group-hover:scale-110 transition-transform duration-500 animate-[breathing_4s_ease-in-out_infinite]">
                  <img
                    src={agent.avatarUrl}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="size-10 rounded-full bg-[#7F0DF2]/10 flex items-center justify-center text-[#7F0DF2] text-xs font-black border border-[#7F0DF2]/20 shadow-inner">
                  {agent.id.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-[#121212] border border-white/10 flex items-center justify-center text-[8px]">
                {agent.gender === "male" ? "♂" : "♀"}
              </div>
            </div>
            <CardTitle className="text-sm font-bold text-white tracking-tight ml-1">
              Agent Profile
            </CardTitle>
          </div>
          <SparklesIcon className="size-3 text-[#7F0DF2] opacity-50 transition-opacity group-hover:opacity-100" />
        </div>
        <CardDescription className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">
          Core Configuration
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 flex-1 pb-2">
        {/* Layer 1: Essential Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5 col-span-2">
            <label className="text-[9px] font-bold text-gray-400 border-l-2 border-[#7F0DF2] pl-1.5 ml-0.5 uppercase tracking-tighter">
              Identity & Orientation
            </label>
            <div className="flex gap-2">
              <Input
                value={agent.name}
                onChange={(e) =>
                  updateAgent(agent.id, { name: e.target.value })
                }
                placeholder="Name..."
                className="h-9 bg-white/3 border-white/5 text-xs text-white placeholder:text-gray-700 focus:bg-white/5 focus:border-[#7F0DF2]/30 flex-1"
              />
              <div className="flex bg-white/3 rounded-md border border-white/5 p-1 h-9">
                <button
                  onClick={() => updateAgent(agent.id, { gender: "male" })}
                  className={cn(
                    "px-2 rounded text-[10px] font-bold transition-all",
                    agent.gender === "male"
                      ? "bg-[#7F0DF2] text-white"
                      : "text-gray-500 hover:text-white",
                  )}
                >
                  M
                </button>
                <button
                  onClick={() => updateAgent(agent.id, { gender: "female" })}
                  className={cn(
                    "px-2 rounded text-[10px] font-bold transition-all",
                    agent.gender === "female"
                      ? "bg-[#7F0DF2] text-white"
                      : "text-gray-500 hover:text-white",
                  )}
                >
                  F
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Description / Bio */}
        <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
          <label className="text-[9px] font-bold text-gray-400 border-l-2 border-[#7F0DF2] pl-1.5 ml-0.5 uppercase tracking-tighter">
            Agent Definition (Role, Expertise, Persona)
          </label>
          <textarea
            value={agent.bio}
            onChange={(e) => updateAgent(agent.id, { bio: e.target.value })}
            placeholder="Define the role, expertise, years of experience, and personality traits of this agent..."
            className="flex-1 min-h-[140px] bg-white/3 border border-white/5 rounded-md p-3 text-xs text-white placeholder:text-gray-700 focus:outline-none focus:bg-white/5 focus:border-[#7F0DF2]/30 transition-all resize-none scroll-smooth"
          />
        </div>
      </CardContent>

      <CardFooter className="pt-2 flex flex-col gap-3">
        <VoiceSettingsModal agent={agent} />

        <Button className="w-full h-12 bg-white text-black hover:bg-gray-200 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-white/5 group/btn">
          Review Agent
          <Settings2Icon className="size-3 ml-2 group-hover/btn:rotate-90 transition-transform" />
        </Button>
      </CardFooter>

      <style>{`
        @keyframes breathing {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 rgba(127, 13, 242, 0.2); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(127, 13, 242, 0.4); }
        }
      `}</style>
    </Card>
  );
};
