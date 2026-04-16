import {
  Carousel,
  CarouselContent,
  CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
} from "@/components/ui/carousel";
import { useCouncilSetupStore, type Agent } from "@/store/council-setup.store";
import { AgentCard } from "./agent-card";

export const MobileAgentCard = ({ agents: propAgents }: { agents?: Agent[] }) => {
  const { agents: storeAgents } = useCouncilSetupStore();
  
  const displayAgents = propAgents || storeAgents;

  return (
    <main className="w-full">
      <Carousel>
        <CarouselContent>
          {displayAgents.map((agent) => (
            <CarouselItem key={agent.id}>
              <AgentCard agent={agent} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
    </main>
  );
};
