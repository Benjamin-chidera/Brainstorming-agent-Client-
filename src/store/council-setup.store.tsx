import { create } from "zustand";
import OpenAI from "openai";
import { Mistral } from "@mistralai/mistralai";
import axios from "axios";
import { toast } from "sonner";

export interface Agent {
  id: string;
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

const VOICE_GENDER_MAPPING: Record<string, "male" | "female"> = {
  alloy: "female",
  echo: "male",
  fable: "female",
  onyx: "male",
  nova: "female",
  shimmer: "female",
};

const createDefaultAgent = (): Agent => ({
  id: crypto.randomUUID(),
  voice: "alloy",
  accent: "neutral",
  tone: "professional",
  gender: "female",
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
  summonCouncil: () => Promise<void>;
  initializeAvatars: () => Promise<void>;
  handleGenerateIntro: (agentId: string) => Promise<string | null>;
  reviewAgentId: string | null;
  setReviewAgentId: (id: string | null) => void;
  playAgentIntroduction: (agent: Agent, text: string) => Promise<void>;
}

export const useCouncilSetupStore = create<CouncilSetupState>((set, get) => ({
  reviewAgentId: null,
  setReviewAgentId: (id) => set({ reviewAgentId: id }),
  councilSize: 1,
  agents: [createDefaultAgent()],
  setCouncilSize: (size) =>
    set((state) => {
      const newAgents = [...state.agents];
      if (size > state.agents.length) {
        for (let i = state.agents.length; i < size; i++) {
          newAgents.push(createDefaultAgent());
        }
      } else if (size < state.agents.length) {
        newAgents.splice(size);
      }
      return { councilSize: size, agents: newAgents };
    }),

  updateAgent: async (id, updates) => {
    const agents = get().agents;
    const targetAgent = agents.find((a) => a.id === id);

    if (!targetAgent) return;

    let finalUpdates = { ...updates };

    if (updates.voice && updates.voice !== targetAgent.voice) {
      const newGender = VOICE_GENDER_MAPPING[updates.voice] || "female";
      finalUpdates.gender = newGender;
      if (newGender !== targetAgent.gender) {
        const newAvatar = await fetchRandomAvatar(newGender);
        finalUpdates.avatarUrl = newAvatar;
      }
    } else if (updates.gender && updates.gender !== targetAgent.gender) {
      const newAvatar = await fetchRandomAvatar(updates.gender);
      finalUpdates.avatarUrl = newAvatar;
    }

    set((state) => ({
      agents: state.agents.map((agent) => {
        if (agent.id === id) {
          return { ...agent, ...finalUpdates };
        }
        return agent;
      }),
    }));
  },

  showCouncilOverview: false,
  setShowCouncilOverview: (show) => set({ showCouncilOverview: show }),

  summonCouncil: async () => {
    const { agents } = get();
    // Filter agents to only include fields expected by the backend schema
    const agentsPayload = agents.map(
      ({ voice, accent, tone, gender, avatarUrl, bio }) => ({
        voice,
        accent,
        tone,
        gender,
        avatarUrl,
        bio,
      }),
    );

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/agents/create-council`,
        agentsPayload,
      );
      if (response.status === 200 || response.status === 201) {
        set({ showCouncilOverview: true });
        toast.success("Council created successfully!");
      }
    } catch (error: any) {
      console.error("Failed to create council:", error);
      toast.error(error.response?.data?.detail || "Failed to create council");
    }
  },


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

    try {
      const client = new Mistral({
        apiKey: import.meta.env.VITE_MISTRAL_API_KEY,
      });

      const chatResponse = await client.chat.complete({
        model: "mistral-medium-latest",
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

      const content = chatResponse.choices?.[0]?.message?.content;
      const intro = typeof content === "string" 
        ? content 
        : Array.isArray(content)
          ? content.map(c => "text" in c ? (c as any).text : "").join("")
          : null;

      console.log(intro);

      set((state) => ({
        agents: state.agents.map((agent) =>
          agent.id === agentId ? { ...agent, bio: intro || agent.bio, intro } : agent,
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
