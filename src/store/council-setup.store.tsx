import { create } from "zustand";
import OpenAI from "openai";
import { Mistral } from "@mistralai/mistralai";
import axios from "axios";
import { toast } from "sonner";

export interface Agent {
  id: string;
  name?: string;
  voice: string;
  accent: string;
  tone: string;
  gender: "male" | "female";
  avatarUrl: string;
  bio: string;
  intro?: string | null;
  isNew?: boolean;
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
  isNew: true,
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

  // New: CRUD & persistence
  isCouncilCreated: boolean;
  isMeetingStarted: boolean;
  setIsMeetingStarted: (status: boolean) => void;
  isFetchingCouncil: boolean;
  fetchCouncil: () => Promise<void>;
  updateAgentOnServer: (id: string) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
}

export const useCouncilSetupStore = create<CouncilSetupState>((set, get) => ({
  reviewAgentId: null,
  setReviewAgentId: (id) => set({ reviewAgentId: id }),
  councilSize: 1,
  agents: [createDefaultAgent()],

  // New state defaults
  isCouncilCreated: false,
  isMeetingStarted: false,
  setIsMeetingStarted: (status) => set({ isMeetingStarted: status }),
  isFetchingCouncil: false,

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

    const finalUpdates = { ...updates };

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

  // ── Fetch existing council from backend ──────────────────────────
  fetchCouncil: async () => {
    set({ isFetchingCouncil: true });
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/agents/get-council`,
      );

      const serverAgents: Agent[] = response.data;

      if (serverAgents && serverAgents.length > 0) {
        set({
          agents: serverAgents.map((a) => ({ ...a, isNew: false })),
          councilSize: serverAgents.length,
          isCouncilCreated: true,
        });
      }
    } catch (error: any) {
      // 404 or empty means no council yet — that's fine, keep defaults
      console.log("No existing council found, starting fresh.");
    } finally {
      set({ isFetchingCouncil: false });
    }
  },

  // ── Create council (POST) ────────────────────────────────────────
  summonCouncil: async () => {
    const { agents, isCouncilCreated } = get();

    const agentsToCreate = (isCouncilCreated
      ? agents.filter((a) => a.isNew)
      : agents
    ).filter((a) => a.bio && a.bio.trim() !== "");

    if (agentsToCreate.length === 0) {
      toast.error("Please ensure the agents you want to create have a bio.");
      return;
    }


    const agentsPayload = agentsToCreate.map(
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
        // Fetch freshly from server to ensure we have the correct server-generated IDs for edits/deletes
        await get().fetchCouncil();
        set({ showCouncilOverview: true, isCouncilCreated: true });
        toast.success("Council updated successfully!");
      }
    } catch (error: any) {
      console.error("Failed to create council:", error);
      toast.error(error.response?.data?.detail || "Failed to create council");
    }
  },

  // ── Update a single agent (PUT) ─────────────────────────────────
  updateAgentOnServer: async (id: string) => {
    const { agents } = get();
    const agent = agents.find((a) => a.id === id);
    if (!agent) return;

    try {
      const { voice, accent, tone, gender, avatarUrl, bio } = agent;
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/agents/update-a-council/${id}`,
        { voice, accent, tone, gender, avatarUrl, bio },
      );
      toast.success("Agent updated!");
    } catch (error: any) {
      console.error("Failed to update agent:", error);
      toast.error(error.response?.data?.detail || "Failed to update agent");
    }
  },

  // ── Delete an agent (DELETE) ─────────────────────────────────────
  deleteAgent: async (id: string) => {
    const { isCouncilCreated } = get();

    console.log(id);
    

    // If the council exists on the server, delete remotely too
    if (isCouncilCreated) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/agents/delete-council/${id}`,
        );
        toast.success("Agent removed!");
      } catch (error: any) {
        console.error("Failed to delete agent:", error);
        toast.error(error.response?.data?.detail || "Failed to delete agent");
        return; // Don't remove locally if server delete failed
      }
    }

    set((state) => {
      const remaining = state.agents.filter((a) => a.id !== id);
      // If all agents deleted, reset council state
      if (remaining.length === 0) {
        return {
          agents: [createDefaultAgent()],
          councilSize: 1,
          isCouncilCreated: false,
        };
      }
      return {
        agents: remaining,
        councilSize: remaining.length,
      };
    });
  },

  initializeAvatars: async () => {
    const agents = get().agents;

    // We only want to fetch avatars for agents that lack them
    const agentsNeedAvatar = agents.filter(a => !a.avatarUrl);
    if (agentsNeedAvatar.length === 0) return;

    // Fetch avatars
    const newAvatars = await Promise.all(
       agentsNeedAvatar.map(async (agent) => {
          return { id: agent.id, avatarUrl: await fetchRandomAvatar(agent.gender) };
       })
    );

    // Apply functionally so we don't overwrite other agent changes (like fetching council)
    set((state) => {
       const newAgents = state.agents.map(agent => {
          const update = newAvatars.find(a => a.id === agent.id);
          if (update) {
             return { ...agent, avatarUrl: update.avatarUrl };
          }
          return agent;
       });
       return { agents: newAgents };
    });
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
          content: `You are a professional persona architect. Your task is to write a high-impact, first-person introduction for an agent.

          STRICT GUIDELINES:
          1. IDENTITY: If the bio does not include a name, invent a professional and fitting name for the agent related to their gender.
          2. SKILLS: If the bio lacks specific skills, infer 3-4 high-level skills based on the agent's implied role and mention them naturally.
          3. VOICE: Write in the first person ("I am..."). Be charismatic and authoritative.
          4. STRUCTURE: Start with the name/identity, follow with a "hook" about their expertise, and conclude with how they help.
          5. LENGTH: Keep it under 60 words. No "AI-speak" or corporate fluff.`
        },
        {
          role: "user",
          content: `Agent Bio: ${targetAgent.bio + "Gender: " + targetAgent.gender}`,
        },
      ],
      // Adding a max_tokens limit keeps the intro short and saves on costs
      maxTokens: 100, 
      temperature: 0.7,
    });

      const content = chatResponse.choices?.[0]?.message?.content;
      const intro =
        typeof content === "string"
          ? content
          : Array.isArray(content)
            ? content.map((c) => ("text" in c ? (c as any).text : "")).join("")
            : null;

      console.log(intro);

      set((state) => ({
        agents: state.agents.map((agent) =>
          agent.id === agentId
            ? { ...agent, bio: intro || agent.bio, intro }
            : agent,
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
