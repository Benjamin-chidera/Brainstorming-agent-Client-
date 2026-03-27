import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { useCouncilSetupStore } from "@/store/council-setup.store";
import { PowerIcon, X, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export const CouncilOverview = () => {
  const {
    showCouncilOverview,
    setShowCouncilOverview,
    agents,
    isMeetingStarted,
    setIsMeetingStarted,
    deleteAgent,
  } = useCouncilSetupStore();

  const [radius, setRadius] = useState(200);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleStartOrContinue = () => {
    setIsMeetingStarted(true);
    navigate("/live-meeting-room");
    setShowCouncilOverview(false);
  };

  const handleDeleteAgent = async (e: React.MouseEvent, agentId: string) => {
    e.stopPropagation();
    await deleteAgent(agentId);
  };

  const handleEditAgent = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Close the modal so the user lands back on the setup grid to edit
    setShowCouncilOverview(false);
  };

  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth < 640) {
        setRadius(130);
      } else if (window.innerWidth < 1024) {
        setRadius(160);
      } else {
        setRadius(200);
      }
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  return (
    <main>
      <AlertDialog
        open={showCouncilOverview}
        onOpenChange={setShowCouncilOverview}
      >
        <AlertDialogContent className="glass max-w-none w-75 md:w-screen h-[40vh] md:h-[70vh] p-0 overflow-hidden border-none shadow-2xl flex items-center justify-center">
          <div className="relative flex items-center justify-center scale-90 sm:scale-100">
            {/* Background Image Container */}
            <div
              className="h-[280px] w-[280px] sm:h-[350px] sm:w-[350px] lg:h-[400px] lg:w-[400px] bg-cover bg-center bg-no-repeat rounded-full relative z-10 shadow-[0_0_50px_rgba(182,255,59,0.2)] border-4 border-white/5"
              style={{
                backgroundImage: "url('/council-over-img.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* Power icon + Start/Continue button */}
              <div className="border border-dashed border-white/10 rounded-full flex flex-col items-center justify-center h-[160px] w-[160px] sm:h-[210px] sm:w-[210px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="shadow-[0_0_50px_rgba(182,255,59,0.2)] border border-white/10 rounded-full p-2 flex flex-col items-center justify-center h-[150px] w-[150px] sm:h-[200px] sm:w-[200px]">
                  <PowerIcon size={20} className="text-[#B6FF3B] mb-2" />
                  <Button
                    className="bg-[#B6FF3B] text-[#0D1117] font-bold hover:bg-[#B6FF3B]/90 cursor-pointer h-9 rounded-full w-full text-xs sm:text-sm"
                    onClick={handleStartOrContinue}
                  >
                    {isMeetingStarted ? "Continue Meeting" : "Start Meeting"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Circular Agent Avatars with hover actions */}
            {agents.map((agent, index) => {
              const angle = (index / agents.length) * 2 * Math.PI - Math.PI / 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const isHovered = hoveredAgentId === agent.id;

              return (
                <div
                  key={agent.id}
                  className="absolute z-20 flex flex-col items-center gap-1 sm:gap-2 group"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  onMouseEnter={() => setHoveredAgentId(agent.id)}
                  onMouseLeave={() => setHoveredAgentId(null)}
                >
                  <div className="relative cursor-pointer">
                    <div
                      className={cn(
                        "size-12 sm:size-16 rounded-full border-2 border-[#B6FF3B]/40 p-0.5 bg-[#161B22]/80 backdrop-blur-sm shadow-xl shadow-[#B6FF3B]/20 transition-all duration-500 animate-[float_6s_ease-in-out_infinite] overflow-hidden",
                        isHovered && "scale-110 border-[#B6FF3B]",
                      )}
                    >
                      {agent.avatarUrl ? (
                        <img
                          src={agent.avatarUrl}
                          alt="Agent"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#B6FF3B] font-black text-[10px] sm:text-xs">
                          {agent.id.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Hover action buttons */}
                    {isHovered && (
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <button
                          onClick={handleEditAgent}
                          className="size-7 rounded-full bg-[#161B22] border border-[#B6FF3B]/40 flex items-center justify-center hover:bg-[#B6FF3B]/20 hover:border-[#B6FF3B] transition-all cursor-pointer"
                          title="Edit agent"
                        >
                          <Pencil className="size-3 text-[#B6FF3B]" />
                        </button>
                        {agents.length > 1 && (
                          <button
                            onClick={(e) => handleDeleteAgent(e, agent.id)}
                            className="size-7 rounded-full bg-[#161B22] border border-red-500/40 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500 transition-all cursor-pointer"
                            title="Delete agent"
                          >
                            <Trash2 className="size-3 text-red-400" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <AlertDialogFooter className="absolute top-2 right-2">
            <AlertDialogCancel className="bg-transparent border-none">
              <X />
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
};
