import React from "react";
import type { Agent } from "store/council-setup.store";
import { useCouncilSetupStore } from "store/council-setup.store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Mic2Icon } from "lucide-react";

interface VoiceSettingsModalProps {
  agent: Agent;
}

export const VoiceSettingsModal = ({ agent }: VoiceSettingsModalProps) => {
  const { updateAgent } = useCouncilSetupStore();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-xs gap-2 py-5 rounded-xl text-gray-300"
        >
          <Mic2Icon className="size-3 text-[#7F0DF2]" />
          Configure Voice
        </Button>
      </DialogTrigger>
      <DialogContent className="glass border-white/10 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Voice Configuration</DialogTitle>
          <DialogDescription className="text-gray-400">
            Customize how {agent.name} sounds and communicates.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Voice Selector
            </label>
            <select
              value={agent.voice}
              onChange={(e) => updateAgent(agent.id, { voice: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7F0DF2]/50"
            >
              <option value="male-1" className="bg-[#1a1a1a]">
                Standard Male
              </option>
              <option value="male-2" className="bg-[#1a1a1a]">
                Deep Male
              </option>
              <option value="female-1" className="bg-[#1a1a1a]">
                Standard Female
              </option>
              <option value="female-2" className="bg-[#1a1a1a]">
                Soft Female
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Accent
            </label>
            <select
              value={agent.accent}
              onChange={(e) =>
                updateAgent(agent.id, { accent: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7F0DF2]/50"
            >
              <option value="us" className="bg-[#1a1a1a]">
                American (US)
              </option>
              <option value="uk" className="bg-[#1a1a1a]">
                British (UK)
              </option>
              <option value="au" className="bg-[#1a1a1a]">
                Australian (AU)
              </option>
              <option value="in" className="bg-[#1a1a1a]">
                Indian (IN)
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Tone
            </label>
            <select
              value={agent.tone}
              onChange={(e) => updateAgent(agent.id, { tone: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#7F0DF2]/50"
            >
              <option value="professional" className="bg-[#1a1a1a]">
                Professional
              </option>
              <option value="friendly" className="bg-[#1a1a1a]">
                Friendly
              </option>
              <option value="authoritative" className="bg-[#1a1a1a]">
                Authoritative
              </option>
              <option value="empathetic" className="bg-[#1a1a1a]">
                Empathetic
              </option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full bg-[#7F0DF2] hover:bg-[#6a0cc9] text-white font-bold uppercase text-xs tracking-widest py-6 rounded-xl">
              Save Settings
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
