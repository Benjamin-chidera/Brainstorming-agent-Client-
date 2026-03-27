import React from "react";
import { useCouncilSetupStore } from "@/store/council-setup.store";
import { AgentCard } from "./agent-card";
import { Button } from "../ui/button";
import { Rocket, Users } from "lucide-react";
import { Spinner } from "../ui/spinner";

export const AgentPods = () => {
  const {
    agents,
    summonCouncil,
    initializeAvatars,
    isCouncilCreated,
    isFetchingCouncil,
    fetchCouncil,
    setShowCouncilOverview,
  } = useCouncilSetupStore();

  // Fetch existing council on mount
  React.useEffect(() => {
    fetchCouncil();
  }, [fetchCouncil]);

  // Initialize avatars whenever agents change (new defaults need avatars)
  React.useEffect(() => {
    if (agents.some((a) => !a.avatarUrl)) {
      initializeAvatars();
    }
  }, [agents, initializeAvatars]);

  if (isFetchingCouncil) {
    return (
      <main className="mt-5 mb-20 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-8 border-[#B6FF3B]/40" />
          <p className="text-[#8B949E] text-xs font-mono uppercase tracking-wider animate-pulse">
            Loading your council...
          </p>
        </div>
      </main>
    );
  }

  const hasNewAgents = agents.some((a) => a.isNew);

  return (
    <main className="mt-5 mb-20">
      <div className="space-y-5">
        <div className="flex gap-3 flex-wrap">
          {(!isCouncilCreated || hasNewAgents) && (
            <Button
              className="bg-[#B6FF3B] text-[#0D1117] font-bold hover:bg-[#B6FF3B]/90 cursor-pointer"
              onClick={summonCouncil}
            >
              {isCouncilCreated ? "Update Council" : "Create Council"}
              <Rocket className="size-4 ml-1" />
            </Button>
          )}

          {isCouncilCreated && (
            <Button
              variant="outline"
              className="border-[#B6FF3B]/30 text-[#B6FF3B] font-bold hover:bg-[#B6FF3B]/10 hover:border-[#B6FF3B]/60 cursor-pointer transition-all duration-300"
              onClick={() => setShowCouncilOverview(true)}
            >
              <Users className="size-4 mr-1" />
              Continue with Agents
            </Button>
          )}
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </main>
  );
};
