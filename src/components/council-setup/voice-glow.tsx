import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { PersonaOrb } from "./persona-orb";
import { SpeechInput } from "./speech-input";
import { Bot, User, Sparkles } from "lucide-react";
import type { Agent } from "@/store/council-setup.store";
import {
  useCouncilSetupStore,
  PERSONALITY_PRESETS,
} from "@/store/council-setup.store";

const ROLE_MAP: Record<string, string> = {
  strategist: "strategist",
  analyst: "analyst",
  executor: "executor",
  critic: "critic",
  director: "executor",
  assessor: "analyst",
  advisor: "strategist",
  researcher: "analyst",
  designer: "executor",
  engineer: "executor",
};

function mapProfessionToRole(profession: string): string {
  const lower = profession.toLowerCase();
  for (const [key, role] of Object.entries(ROLE_MAP)) {
    if (lower.includes(key)) return role;
  }
  return "strategist";
}

interface VoiceGlowProps {
  onComplete: () => void;
}

export const VoiceGlow = ({ onComplete }: VoiceGlowProps) => {
  const [volume, setVolume] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const { setCouncilSize, agents } = useCouncilSetupStore();
  const hasCompletedRef = useRef(false);

  const { messages, sendMessage, isLoading } = useChat({
    api: "/api/chat",
    onToolCall: ({ toolCall }) => {
      if (
        toolCall.toolName === "generateAgentDrafts" &&
        !hasCompletedRef.current
      ) {
        hasCompletedRef.current = true;
        const { agents: drafts } = toolCall.args as {
          agents: { name: string; profession: string; bio: string }[];
        };

        // Map drafts to the Agent shape and populate the Zustand store
        const presetKeys = Object.keys(PERSONALITY_PRESETS) as Array<
          keyof typeof PERSONALITY_PRESETS
        >;

        const newAgents: Agent[] = drafts.map((draft, index) => ({
          id: crypto.randomUUID(),
          name: draft.name,
          role: mapProfessionToRole(draft.profession),
          expertise: [draft.profession],
          personality: {
            ...PERSONALITY_PRESETS[presetKeys[index % presetKeys.length]],
          },
          preset: presetKeys[index % presetKeys.length],
          voice: "default",
          accent: "neutral",
          tone: "professional",
          gender: (index % 2 === 0 ? "male" : "female") as "male" | "female",
          avatarUrl: "",
          bio: draft.bio || "",
        }));

        // Update the store
        setCouncilSize(newAgents.length);

        // Small delay to let the store set, then update agents + transition
        setTimeout(() => {
          const store = useCouncilSetupStore.getState();
          // Replace agents with the AI-generated ones
          for (let i = 0; i < newAgents.length; i++) {
            if (store.agents[i]) {
              store.updateAgent(store.agents[i].id, {
                name: newAgents[i].name,
                role: newAgents[i].role,
                expertise: newAgents[i].expertise,
                personality: newAgents[i].personality,
                preset: newAgents[i].preset,
              });
            }
          }
          // Initialize avatars
          store.initializeAvatars();
          // Transition to card grid
          setTimeout(onComplete, 800);
        }, 300);
      }
    },
  });

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [messages]);

  // Send initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      sendMessage({
        text: "Hello! I want to set up my AI council. Help me pick the right agents for my team.",
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleTranscript = (text: string) => {
    console.log(text);
    sendMessage({ text });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center gap-6 py-8"
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 text-[#7F0DF2]"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-black uppercase tracking-[0.3em]">
          Voice Configuration
        </span>
        <Sparkles className="w-4 h-4" />
      </motion.div>

      {/* Persona Orb */}
      <PersonaOrb
        volume={volume}
        isActive={isLoading}
        isListening={isListening}
      />

      {/* Transcript Area */}
      <motion.div
        ref={transcriptRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-lg h-48 overflow-y-auto glass rounded-2xl p-4 space-y-3 scroll-smooth"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(127, 13, 242, 0.3) transparent",
        }}
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-white/20 text-sm">
            Initializing Manager Agent...
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2.5 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#7F0DF2]/20 flex items-center justify-center border border-[#7F0DF2]/30">
                  <Bot className="w-3.5 h-3.5 text-[#7F0DF2]" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#7F0DF2]/20 text-white/90 border border-[#7F0DF2]/20 rounded-br-md"
                    : "bg-white/5 text-white/80 border border-white/5 rounded-bl-md"
                }`}
              >
                {msg.parts.map((part, pIdx) =>
                  part.type === "text" ? part.text : null,
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-2.5 items-center"
          >
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#7F0DF2]/20 flex items-center justify-center border border-[#7F0DF2]/30">
              <Bot className="w-3.5 h-3.5 text-[#7F0DF2]" />
            </div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#7F0DF2]/60"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Speech Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-lg"
      >
        <SpeechInput
          onTranscript={handleTranscript}
          onVolumeChange={setVolume}
          onListeningChange={setIsListening}
          isDisabled={isLoading}
        />
      </motion.div>
    </motion.div>
  );
};
