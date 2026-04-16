import { useCouncilSetupStore } from "@/store/council-setup.store";
import { useMeetingStore } from "@/store/meeting.store";
import { MuteBtn } from "./Mute-btn";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { InviteModal } from "./invite-modal";

export const InviteAgents = () => {
  const { agents } = useCouncilSetupStore();
  const { mutedAgents, setInviteModal } = useMeetingStore();

  return (
    <main className="w-full max-w-[400px] lg:max-w-none">
      <h1 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
        THE COUNCIL
      </h1>

      <section className="glass w-full lg:w-[220px] h-full rounded-2xl overflow-hidden p-1 border border-white/10 shadow-lg">
        <section className="h-[200px] lg:h-[250px] p-3 overflow-y-auto relative scrollbar-hide">
          <div className="space-y-3">
            {agents.map((agent) => {
              const isMuted = mutedAgents.has(agent.id);
              return (
                <div
                  key={agent.id}
                  className={cn(
                    "flex items-center justify-between gap-3 p-2 rounded-lg transition-all duration-300",
                    isMuted
                      ? "bg-red-500/10 border border-red-500/20"
                      : "bg-white/5 border border-transparent hover:bg-white/10"
                  )}
                >
                  {/* Avatar with muted overlay */}
                  <div className="relative shrink-0">
                    <img
                      src={agent.avatarUrl}
                      alt={agent.name ?? "Agent"}
                      className={cn(
                        "w-9 h-9 object-cover rounded-full transition-all duration-300",
                        isMuted ? "grayscale opacity-50" : ""
                      )}
                    />
                    {isMuted && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center size-3.5 bg-red-500 rounded-full border border-black">
                        {/* tiny muted indicator dot */}
                      </span>
                    )}
                  </div>

                  {/* Agent name */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-[10px] font-semibold truncate transition-colors duration-300",
                        isMuted ? "text-white/30 line-through" : "text-white/80"
                      )}
                    >
                      {agent.name ?? "Agent"}
                    </p>
                    {isMuted && (
                      <p className="text-[8px] text-red-400/70 uppercase tracking-wider">
                        Muted
                      </p>
                    )}
                  </div>

                  {/* Mute toggle button */}
                  <div className="shrink-0">
                    <MuteBtn agentId={agent.id} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {agents.length < 10 && (
          <div className="p-2 border-t border-white/5">
            <Button className="text-xs text-black font-bold h-9 cursor-pointer w-full bg-[#B6FF3B] hover:bg-[#B6FF3B]/90 transition-all rounded-xl shadow-[0_0_15px_rgba(127,13,242,0.3)]"
              onClick={() => setInviteModal(true)}
            >
              <Plus size={16} />
              <span>Invite a member</span>
            </Button>
          </div>
        )}
      </section>

      <InviteModal />
    </main>
  );
};
