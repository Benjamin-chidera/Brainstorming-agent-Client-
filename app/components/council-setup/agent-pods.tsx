import React from "react";
import { useCouncilSetupStore } from "store/council-setup.store";
import { AgentCard } from "./agent-card";
import { Button } from "../ui/button";
import { Rocket } from "lucide-react";

export const AgentPods = () => {
  const { agents } = useCouncilSetupStore();

  return (
    <main className="mt-5 mb-20">
      <div className=" space-y-5">
        <Button className=" bg-[#7F0DF2] text-white font-bold hover:bg-[#7a20d5] cursor-pointer" disabled>
          Summon Council
          <Rocket />
        </Button>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </main>
  );
};
