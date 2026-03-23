import React from "react";
import { useCouncilSetupStore } from "@/store/council-setup.store";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  FileText,
  Search,
  Pin,
  Lightbulb,
  MessageSquare,
  Mail,
  Scale,
  Brain,
  BarChart3,
  FileJson,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";

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

        return <AgentItem key={agent.id} agent={agent} x={x} y={y} />;
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

const AgentItem = ({ agent, x, y }: { agent: any; x: number; y: number }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <div
      className="absolute z-20 flex flex-col items-center gap-2 group pointer-events-none transition-all duration-700 ease-out"
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <HoverCard
        open={isHovered || isDropdownOpen}
        onOpenChange={setIsHovered}
        openDelay={0}
        closeDelay={200}
      >
        <HoverCardTrigger asChild>
          <div className="relative pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95">
            <div className="size-14 md:size-16 rounded-full border-2 border-[#7F0DF2]/60 p-0.5 bg-[#050505] backdrop-blur-xl shadow-2xl shadow-[#7F0DF2]/40 transition-all duration-500 group-hover:rotate-12 group-hover:border-[#7F0DF2] animate-[float_6s_ease-in-out_infinite] overflow-hidden">
              {agent.avatarUrl ? (
                <img
                  src={agent.avatarUrl}
                  alt="Agent"
                  className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#7F0DF2] font-black text-xs md:text-sm">
                  {agent.id.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent
          side="top"
          align="center"
          sideOffset={20}
          className="w-64 p-3 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(127,13,242,0.3)] animate-in fade-in zoom-in duration-300 pointer-events-auto"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <h4 className="text-[11px] font-black text-white/90 uppercase tracking-tighter">
                  {" "}
                  Council Member
                </h4>
              </div>
              <div className="size-2 bg-[#7F0DF2] rounded-full animate-pulse" />
            </div>

            <div className="grid grid-cols-1 gap-1.5">
              {[
                { icon: <FileText size={14} />, label: "Summarize Meeting" },
                { icon: <Search size={14} />, label: "Research Topic" },
                { icon: <Pin size={14} />, label: "Extract Action Items" },
                { icon: <Lightbulb size={14} />, label: "Idea Generator" },
                { icon: <MessageSquare size={14} />, label: "Ask the Meeting" },
              ].map((btn, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="h-9 justify-start gap-3 px-3 text-[10px] font-bold text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300 group/btn"
                >
                  <span className="text-[#7F0DF2] group-hover/btn:scale-110 transition-transform">
                    {btn.icon}
                  </span>
                  {btn.label}
                  <ChevronRight
                    size={12}
                    className="ml-auto opacity-0 group-hover/btn:opacity-40 -translate-x-2 group-hover/btn:translate-x-0 transition-all"
                  />
                </Button>
              ))}

              <DropdownMenu onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 justify-start gap-3 px-3 text-[10px] font-bold text-white/40 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 rounded-xl transition-all duration-300"
                  >
                    <MoreHorizontal size={14} />
                    Advanced Tasks
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  sideOffset={15}
                  className="w-56 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-1 shadow-2xl"
                >
                  {[
                    {
                      icon: <Mail size={14} />,
                      label: "Send Summary to email",
                    },
                    { icon: <Scale size={14} />, label: "Decision Tracker" },
                    { icon: <Brain size={14} />, label: "Generate Ideas" },
                    {
                      icon: <BarChart3 size={14} />,
                      label: "Analyze Sentiment",
                    },
                    { icon: <FileJson size={14} />, label: "Generate Report" },
                  ].map((item, i) => (
                    <DropdownMenuItem
                      key={i}
                      className="flex items-center gap-3 px-3 py-2 text-[10px] font-bold text-white/70 focus:bg-[#7F0DF2]/10 focus:text-white rounded-lg cursor-pointer transition-colors"
                    >
                      <span className="text-[#7F0DF2]">{item.icon}</span>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>

    </div>
  );
};
