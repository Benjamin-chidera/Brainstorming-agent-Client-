import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { useCouncilSetupStore } from "store/council-setup.store";
import { X } from "lucide-react";

export const CouncilOverview = () => {
  const { showCouncilOverview, setShowCouncilOverview, agents } =
    useCouncilSetupStore();

  const radius = 200; // Distance from center

  return (
    <main>
      <AlertDialog
        open={showCouncilOverview}
        onOpenChange={setShowCouncilOverview}
      >
        <AlertDialogContent className="glass max-w-none w-screen h-[70vh] p-0 overflow-hidden border-none shadow-2xl flex items-center justify-center ">
          <div className="relative flex items-center justify-center">
            {/* Background Image Container */}
            <div
              className="h-[400px] w-[400px] bg-cover bg-center bg-no-repeat rounded-full relative z-10 shadow-[0_0_50px_rgba(127,13,242,0.3)] border-4 border-white/5"
              style={{
                backgroundImage: "url('/council-over-img.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>

            {/* Circular Agent Avatars */}
            {agents.map((agent, index) => {
              const angle = (index / agents.length) * 2 * Math.PI - Math.PI / 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={agent.id}
                  className="absolute z-20 flex flex-col items-center gap-2 group pointer-events-none"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  <div className="relative pointer-events-auto cursor-pointer">
                    <div className="size-16 rounded-full border-2 border-[#7F0DF2]/40 p-0.5 bg-[#121212]/80 backdrop-blur-sm shadow-xl shadow-[#7F0DF2]/20 transition-all duration-500 group-hover:scale-110 group-hover:border-[#7F0DF2] animate-[float_6s_ease-in-out_infinite] overflow-hidden">
                      {agent.avatarUrl ? (
                        <img
                          src={agent.avatarUrl}
                          alt={agent.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#7F0DF2] font-black text-xs">
                          {agent.id.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {/* Role Badge */}
                    <div className="absolute -bottom-1 -right-1 bg-[#7F0DF2] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white/10 shadow-lg capitalize">
                      {agent.role}
                    </div>
                  </div>
                  {/* Name Label */}
                  <div className="bg-[#121212]/90 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full shadow-2xl transform transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105 pointer-events-auto">
                    <p className="text-[10px] font-bold text-white tracking-wide whitespace-nowrap">
                      {agent.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <AlertDialogFooter className=" absolute top-2 right-2">
            <AlertDialogCancel className=" bg-transparent border-none">
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
