import React from "react";
import { useCouncilSetupStore } from "store/council-setup.store";

export const AgentGroup = () => {
  const { agents } = useCouncilSetupStore();
  const [windowWidth, setWindowWidth] = React.useState(0);

  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const radius = isMobile ? 120 : 150;

  if (!agents.length) return null;

  return (
    <div className="relative h-[320px] w-[320px] md:h-[400px] md:w-[400px] flex items-center justify-center scale-90 sm:scale-100 transition-transform duration-500">
      {/* Background Image Container */}
      <div
        className="h-[200px] w-[200px] md:h-[250px] md:w-[250px] bg-cover bg-center bg-no-repeat rounded-full relative z-10 shadow-[0_0_60px_rgba(127,13,242,0.4)] border-4 border-white/10 overflow-hidden"
        style={{
          backgroundImage: "url('/council-over-img.png')",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#7F0DF2]/10 to-[#7F0DF2]/30"></div>
        <div className="border border-dashed border-white/20 rounded-full flex flex-col items-center justify-center h-full w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          <div className="rounded-full p-2 flex flex-col items-center justify-center h-5/6 w-5/6 bg-black/40 backdrop-blur-sm">
            <p className="text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">
              Council Active
            </p>
          </div>
        </div>
      </div>

      {/* Circular Agent Avatars */}
      {agents.map((agent, index) => {
        const angle = (index / agents.length) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={agent.id}
            className="absolute z-20 flex flex-col items-center gap-2 group pointer-events-none transition-all duration-700 ease-out"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <div className="relative pointer-events-auto cursor-pointer">
              <div className="size-14 md:size-16 rounded-full border-2 border-[#7F0DF2]/60 p-0.5 bg-[#050505] backdrop-blur-xl shadow-2xl shadow-[#7F0DF2]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:border-[#7F0DF2] animate-[float_6s_ease-in-out_infinite] overflow-hidden">
                {agent.avatarUrl ? (
                  <img
                    src={agent.avatarUrl}
                    alt={agent.name}
                    className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#7F0DF2] font-black text-xs md:text-sm">
                    {agent.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              {/* Role Badge */}
              <div className="absolute -bottom-1 -right-1 bg-[#7F0DF2] text-white text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded-full border border-white/20 shadow-lg capitalize">
                {agent.role}
              </div>
            </div>
            {/* Name Label */}
            <div className="bg-black/90 backdrop-blur-xl border border-white/10 px-3 py-1 rounded-full shadow-2xl transform transition-all duration-300 opacity-40 group-hover:opacity-100 group-hover:scale-110 pointer-events-auto border-t-white/20">
              <p className="text-[9px] md:text-[10px] font-black text-white tracking-widest whitespace-nowrap">
                {agent.name}
              </p>
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};
