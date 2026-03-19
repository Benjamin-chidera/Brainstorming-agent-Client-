import { create } from "zustand";
import OpenAI from "openai";

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
  bio: string;
  intro?: string | null;
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
  voice: "alloy",
  accent: "neutral",
  tone: "professional",
  gender: index % 2 === 0 ? "male" : "female",
  avatarUrl: "",
  bio: "",
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
  // handleRefineBio: (agentId: string) => Promise<void>;
  handleGenerateIntro: (agentId: string) => Promise<string | null>;
  // refiningAgentIds: string[];
  reviewAgentId: string | null;
  setReviewAgentId: (id: string | null) => void;
  playAgentIntroduction: (agent: Agent, text: string) => Promise<void>;
}

export const useCouncilSetupStore = create<CouncilSetupState>((set, get) => ({
  // refiningAgentIds: [],
  reviewAgentId: null,
  setReviewAgentId: (id) => set({ reviewAgentId: id }),
  isRefiningBio: false,
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

  handleGenerateIntro: async (agentId: string) => {
    const { agents } = get();
    const targetAgent = agents.find((a) => a.id === agentId);
    if (!targetAgent || !targetAgent.bio) return null;

    const client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      baseURL: import.meta.env.VITE_OPENAI_API_URL,
      dangerouslyAllowBrowser: true,
    });

    try {
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant. You have to generate a short introduction for the agent based on the bio provided. The introduction should be personalized and engaging. The introduction should be in first person.",
          },
          {
            role: "user",
            content: targetAgent.bio,
          },
        ],
      });

      const intro = response.choices[0].message.content;
      console.log(intro);

      set((state) => ({
        agents: state.agents.map((agent) =>
          agent.id === agentId ? { ...agent, intro } : agent,
        ),
      }));

      return intro;
    } catch (error) {
      console.error("Failed to generate intro:", error);
      return null;
    }
  },

  playAgentIntroduction: async (agent: Agent, text: string) => {
    try {
      const client = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        baseURL: import.meta.env.VITE_OPENAI_API_URL,
        dangerouslyAllowBrowser: true,
      });

      const response = await client.audio.speech.create({
        model: "tts-1",
        voice: (agent.voice as any) || "alloy",
        input: text,
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      await audio.play();
    } catch (error) {
      console.error("TTS failed:", error);
    }
  },
}));
