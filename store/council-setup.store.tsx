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
  gender: "male" | "female";
  avatarUrl: string;
}

const fetchRandomAvatar = async (gender: "male" | "female") => {
  try {
    const response = await fetch(`https://randomuser.me/api/?gender=${gender}`);
    const data = await response.json();
    return data.results[0].picture.large;
  } catch (error) {
    console.error("Error fetching random avatar:", error);
    return "";
  }
};

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
  gender: index % 2 === 0 ? "male" : "female",
  avatarUrl: "",
});

interface CouncilSetupState {
  councilSize: number;
  agents: Agent[];
  setCouncilSize: (size: number) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  showCouncilOverview: boolean;
  setShowCouncilOverview: (show: boolean) => void;
  summonCouncil: () => void;
  initializeAvatars: () => Promise<void>;
}

export const useCouncilSetupStore = create<CouncilSetupState>((set, get) => ({
  councilSize: 1,
  agents: [createDefaultAgent(0)],
  // this is for the set council size
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

  // this is for the update agent
  updateAgent: async (id, updates) => {
    const agents = get().agents;
    const targetAgent = agents.find((a) => a.id === id);

    if (!targetAgent) return;

    let finalUpdates = { ...updates };

    // If gender changed, fetch a new avatar
    if (updates.gender && updates.gender !== targetAgent.gender) {
      const newAvatar = await fetchRandomAvatar(updates.gender);
      finalUpdates.avatarUrl = newAvatar;
    }

    set((state) => ({
      agents: state.agents.map((agent) => {
        if (agent.id === id) {
          const newAgent = { ...agent, ...finalUpdates };
          // If preset changed, update personality values
          if (finalUpdates.preset && PERSONALITY_PRESETS[finalUpdates.preset]) {
            newAgent.personality = {
              ...PERSONALITY_PRESETS[finalUpdates.preset],
            };
          }
          return newAgent;
        }
        return agent;
      }),
    }));
  },

  // this is for the council overview modal
  showCouncilOverview: false,
  setShowCouncilOverview: (show) => set({ showCouncilOverview: show }),

  // this is for the summon council button
  summonCouncil: () => set({ showCouncilOverview: true }),

  initializeAvatars: async () => {
    const agents = get().agents;
    const updatedAgents = await Promise.all(
      agents.map(async (agent) => {
        if (!agent.avatarUrl) {
          const avatar = await fetchRandomAvatar(agent.gender);
          return { ...agent, avatarUrl: avatar };
        }
        return agent;
      }),
    );
    set({ agents: updatedAgents });
  },
}));
