import { create } from "zustand";

export type PersonalityPreset =
  | "analytical"
  | "visionary"
  | "risk-averse"
  | "balanced"
  | "aggressive"
  | "experimental";

export const PERSONALITY_PRESETS: Record<
  PersonalityPreset,
  Agent["personality"]
> = {
  analytical: {
    creativity: 2,
    riskTolerance: 3,
    optimism: 5,
    analyticalDepth: 9,
  },
  visionary: {
    creativity: 9,
    riskTolerance: 8,
    optimism: 9,
    analyticalDepth: 4,
  },
  "risk-averse": {
    creativity: 4,
    riskTolerance: 1,
    optimism: 4,
    analyticalDepth: 7,
  },
  balanced: {
    creativity: 5,
    riskTolerance: 5,
    optimism: 5,
    analyticalDepth: 5,
  },
  aggressive: {
    creativity: 7,
    riskTolerance: 9,
    optimism: 8,
    analyticalDepth: 6,
  },
  experimental: {
    creativity: 9,
    riskTolerance: 7,
    optimism: 6,
    analyticalDepth: 8,
  },
};

export interface Agent {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  personality: {
    creativity: number;
    riskTolerance: number;
    optimism: number;
    analyticalDepth: number;
  };
  preset: PersonalityPreset;
  voice: string;
  accent: string;
  tone: string;
}

const createDefaultAgent = (index: number): Agent => ({
  id: crypto.randomUUID(),
  name: `Agent ${index + 1}`,
  role: "strategist",
  expertise: [],
  personality: { ...PERSONALITY_PRESETS.balanced },
  preset: "balanced",
  voice: "default",
  accent: "neutral",
  tone: "professional",
});

interface CouncilSetupState {
  councilSize: number;
  agents: Agent[];
  setCouncilSize: (size: number) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
}

export const useCouncilSetupStore = create<CouncilSetupState>((set) => ({
  councilSize: 1,
  agents: [createDefaultAgent(0)],
  setCouncilSize: (size) =>
    set((state) => {
      const newAgents = [...state.agents];
      if (size > state.agents.length) {
        for (let i = state.agents.length; i < size; i++) {
          newAgents.push(createDefaultAgent(i));
        }
      } else if (size < state.agents.length) {
        newAgents.splice(size);
      }
      return { councilSize: size, agents: newAgents };
    }),
  updateAgent: (id, updates) =>
    set((state) => ({
      agents: state.agents.map((agent) => {
        if (agent.id === id) {
          const newAgent = { ...agent, ...updates };
          // If preset changed, update personality values
          if (updates.preset && PERSONALITY_PRESETS[updates.preset]) {
            newAgent.personality = { ...PERSONALITY_PRESETS[updates.preset] };
          }
          return newAgent;
        }
        return agent;
      }),
    })),
}));
