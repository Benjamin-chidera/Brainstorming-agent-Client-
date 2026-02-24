import React, { useState } from "react";
import type { Agent, PersonalityPreset } from "store/council-setup.store";
import {
  useCouncilSetupStore,
  PERSONALITY_PRESETS,
} from "store/council-setup.store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Slider } from "~/components/ui/slider";
import { Button } from "~/components/ui/button";
import { VoiceSettingsModal } from "./voice-settings-modal";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  Settings2Icon,
} from "lucide-react";
import { cn } from "~/lib/utils";

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard = ({ agent }: AgentCardProps) => {
  const { updateAgent } = useCouncilSetupStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePersonalityChange = (
    key: keyof Agent["personality"],
    value: number,
  ) => {
    updateAgent(agent.id, {
      personality: { ...agent.personality, [key]: value },
    });
  };

  const presets: { id: PersonalityPreset; label: string; emoji: string }[] = [
    { id: "analytical", label: "Analytical", emoji: "🔍" },
    { id: "visionary", label: "Visionary", emoji: "🚀" },
    { id: "risk-averse", label: "Risk-Averse", emoji: "🛡" },
    { id: "balanced", label: "Balanced", emoji: "⚖" },
    { id: "aggressive", label: "Aggressive", emoji: "🔥" },
    { id: "experimental", label: "Experimental", emoji: "🧪" },
  ];

  return (
    <Card className="glass flex flex-col h-full border-white/10 group transition-all duration-300 hover:border-[#7F0DF2]/30">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#7F0DF2]/10 flex items-center justify-center text-[#7F0DF2] text-[10px] font-black border border-[#7F0DF2]/20 shadow-inner">
              {agent.id.slice(0, 2).toUpperCase()}
            </div>
            <CardTitle className="text-sm font-bold text-white tracking-tight">
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
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 border-l-2 border-[#7F0DF2] pl-1.5 ml-0.5 uppercase tracking-tighter">
              Identity
            </label>
            <Input
              value={agent.name}
              onChange={(e) => updateAgent(agent.id, { name: e.target.value })}
              placeholder="Name..."
              className="h-9 bg-white/3 border-white/5 text-xs text-white placeholder:text-gray-700 focus:bg-white/5 focus:border-[#7F0DF2]/30"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-400 border-l-2 border-[#7F0DF2] pl-1.5 ml-0.5 uppercase tracking-tighter">
              Function
            </label>
            <select
              value={agent.role}
              onChange={(e) => updateAgent(agent.id, { role: e.target.value })}
              className="w-full h-9 bg-white/3 border border-white/5 rounded-md px-2 text-xs text-white focus:outline-none focus:border-[#7F0DF2]/30 transition-all cursor-pointer"
            >
              <option value="strategist" className="bg-[#121212]">
                Strategist
              </option>
              <option value="analyst" className="bg-[#121212]">
                Analyst
              </option>
              <option value="executor" className="bg-[#121212]">
                Executor
              </option>
              <option value="critic" className="bg-[#121212]">
                Critic
              </option>
            </select>
          </div>
        </div>

        {/* Personality Presets */}
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-gray-400 border-l-2 border-[#7F0DF2] pl-1.5 ml-0.5 uppercase tracking-tighter">
            Personality Archetype
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => updateAgent(agent.id, { preset: preset.id })}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl border text-[9px] transition-all duration-200 group/preset",
                  agent.preset === preset.id
                    ? "bg-[#7F0DF2] border-[#7F0DF2] text-white shadow-lg shadow-[#7F0DF2]/20 scale-[1.02]"
                    : "bg-white/2 border-white/5 text-gray-400 hover:border-white/10 hover:bg-white/4",
                )}
              >
                <span className="text-xs mb-0.5">{preset.emoji}</span>
                <span className="font-bold truncate w-full px-1">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Link */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-[9px] font-black text-[#7F0DF2] uppercase tracking-[0.2em] hover:opacity-80 transition-opacity py-2"
        >
          {showAdvanced ? (
            <ChevronUpIcon className="size-3" />
          ) : (
            <ChevronDownIcon className="size-3" />
          )}
          {showAdvanced ? "Hide Advanced" : "Advanced Customization"}
        </button>

        {/* Layer 2: Advanced Settings (Collapsible) */}
        {showAdvanced && (
          <div className="space-y-5 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Personality Sliders */}
            <div className="space-y-3">
              {[
                { label: "Creativity", key: "creativity" },
                { label: "Risk Tolerance", key: "riskTolerance" },
                { label: "Optimism", key: "optimism" },
                { label: "Analytical Depth", key: "analyticalDepth" },
              ].map((trait) => (
                <div key={trait.key} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[8px] px-0.5">
                    <span className="uppercase font-black text-gray-500 tracking-tighter">
                      {trait.label}
                    </span>
                    <span className="text-[#7F0DF2] font-black underline decoration-sky-500/30">
                      {(agent.personality as any)[trait.key]}
                    </span>
                  </div>
                  <Slider
                    value={[(agent.personality as any)[trait.key]]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(val) =>
                      handlePersonalityChange(trait.key as any, val[0])
                    }
                    className="h-3"
                  />
                </div>
              ))}
            </div>

            {/* Expertise Tags */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold text-gray-400 border-l-2 border-[#7F0DF2] pl-1.5 ml-0.5 uppercase tracking-tighter">
                Specialized Expertise
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2 px-0.5">
                {agent.expertise.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-white/5 text-white/50 text-[8px] px-2 py-0.5 rounded-full border border-white/5 uppercase font-black hover:border-[#7F0DF2]/30 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Input
                placeholder="Type & Enter..."
                className="h-8 bg-white/2 border-white/5 text-[10px] text-white focus:border-[#7F0DF2]/30"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    updateAgent(agent.id, {
                      expertise: [...agent.expertise, e.currentTarget.value],
                    });
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 flex flex-col gap-3">
        <VoiceSettingsModal agent={agent} />

        <Button className="w-full h-12 bg-white text-black hover:bg-gray-200 font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all shadow-xl shadow-white/5 group/btn">
          Review Agent
          <Settings2Icon className="size-3 ml-2 group-hover/btn:rotate-90 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};
