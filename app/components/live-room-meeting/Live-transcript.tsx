import { AudioLines } from "lucide-react";
import React from "react";

export const LiveTranscript = () => {
  return (
    <main className="glass p-5 rounded-3xl w-full max-w-[900px] h-[180px] mx-auto border border-white/5 shadow-2xl backdrop-blur-3xl group transition-all duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
        <h1 className="text-xs font-black text-white flex items-center gap-3 tracking-[0.2em] uppercase">
          <div className="flex items-end gap-0.5 h-4">
            <div className="w-1 bg-[#7F0DF2] animate-[sound_0.8s_ease-in-out_infinite] h-2"></div>
            <div className="w-1 bg-[#7F0DF2] animate-[sound_1.1s_ease-in-out_infinite] h-4"></div>
            <div className="w-1 bg-[#7F0DF2] animate-[sound_0.9s_ease-in-out_infinite] h-3"></div>
          </div>
          Live Transcript
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 backdrop-blur-md bg-white/5 p-1.5 rounded-full border border-white/10">
            <div className="size-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"></div>
            <div className="size-2 rounded-full bg-yellow-500/50"></div>
            <div className="size-2 rounded-full bg-green-500/50"></div>
          </div>
        </div>
      </div>
      <div className="mt-1 overflow-y-auto h-[100px] text-[11px] text-white/70 leading-relaxed pr-2 space-y-4 scrollbar-hide">
        <div className="flex gap-4 group/item">
          <span className="text-[#7F0DF2] font-black whitespace-nowrap opacity-40 group-hover/item:opacity-100 transition-opacity">
            09:41:22
          </span>
          <p>
            <span className="text-white font-black mr-2 bg-white/5 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Lead Agent
            </span>{" "}
            Welcome everyone. Let's begin the architectural synthesis for the
            new autonomous framework.
          </p>
        </div>
        <div className="flex gap-4 group/item">
          <span className="text-cyan-400 font-black whitespace-nowrap opacity-40 group-hover/item:opacity-100 transition-opacity">
            09:42:05
          </span>
          <p>
            <span className="text-cyan-400 font-black mr-2 bg-cyan-400/5 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              Research Agent
            </span>{" "}
            Dataset processing complete. I've identified three critical entry
            points for optimization in the neural pipeline.
          </p>
        </div>
        <div className="flex gap-4 group/item opacity-50">
          <span className="text-white/20 font-black whitespace-nowrap opacity-20">
            09:43:10
          </span>
          <p>
            <span className="text-white/40 font-black mr-2 bg-white/5 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
              System
            </span>{" "}
            Cognitive bridge established. High-latency protocols avoided.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes sound {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
      `}</style>
    </main>
  );
};
