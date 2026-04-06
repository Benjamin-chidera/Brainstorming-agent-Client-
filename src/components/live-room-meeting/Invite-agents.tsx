import { useCouncilSetupStore } from "@/store/council-setup.store";
import { MuteBtn } from "./Mute-btn";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

export const InviteAgents = () => {
  const { agents } = useCouncilSetupStore();

  console.log(agents);

  return (
    <main className="w-full max-w-[400px] lg:max-w-none">
      <h1 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
        THE COUNCIL
      </h1>

      <section className="glass w-full lg:w-[220px] h-full rounded-2xl overflow-hidden p-1 border border-white/10 shadow-lg">
        <section className="h-[200px] lg:h-[250px] p-3 overflow-y-auto relative scrollbar-hide">
          <div className="space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between gap-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {/* <div className="p-1.5 bg-[#7F0DF2]/20 rounded-full border border-[#7F0DF2]/30 flex items-center justify-center">
                  <Laptop size={14} className="text-[#7F0DF2]" />
                </div> */}
                <div className="flex-1 min-w-0">
                  {/* <p className="capitalize text-xs font-medium truncate text-white/90">
                    {agent.name}
                  </p> */}

                  <img
                    src={agent.avatarUrl}
                    alt=""
                    className="w-10 h-10  object-cover rounded-full"
                  />
                </div>
                <div>
                  <MuteBtn />
                </div>
              </div>
            ))}
          </div>
        </section>

        {agents.length < 10 && (
          <div className="p-2 border-t border-white/5">
            <Button className="text-xs text-black font-bold h-9 cursor-pointer w-full bg-[#B6FF3B] hover:bg-[#B6FF3B]/90 transition-all rounded-xl shadow-[0_0_15px_rgba(127,13,242,0.3)]">
              <Plus size={16} />
              <span>Invite Agent</span>
            </Button>
          </div>
        )}
      </section>
    </main>
  );
};
