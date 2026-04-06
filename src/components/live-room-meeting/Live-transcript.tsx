import { useEffect, useRef } from "react";
import { useMeetingStore } from "@/store/meeting.store";

const formatTime = (ts: number) => {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const LiveTranscript = () => {
  const { messages, isProcessing } = useMeetingStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  return (
    <main className="glass p-5 rounded-3xl w-full max-w-[900px] h-[220px] mx-auto border border-white/5 shadow-2xl backdrop-blur-3xl group transition-all duration-500 overflow-hidden hover:border-[#B6FF3B]">
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
        <h1 className="text-xs font-black text-white flex items-center gap-3 tracking-[0.2em] uppercase">
          <div className="flex items-end gap-0.5 h-4">
            <div className="w-1 bg-[#B6FF3B] animate-[sound_0.8s_ease-in-out_infinite] h-2"></div>
            <div className="w-1 bg-[#B6FF3B] animate-[sound_1.1s_ease-in-out_infinite] h-4"></div>
            <div className="w-1 bg-[#B6FF3B] animate-[sound_0.9s_ease-in-out_infinite] h-3"></div>
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
      <div 
        ref={scrollRef}
        className="mt-1 overflow-y-auto h-[120px] text-[11px] text-white/70 leading-relaxed pr-2 space-y-4 scrollbar-hide"
      >
        {messages.length === 0 && !isProcessing ? (
            <div className="h-full flex items-center justify-center opacity-30 text-xs">
                Establishing communication link...
            </div>
        ) : (
            <>
                {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-4 group/item">
                        <span className="text-[#7F0DF2] font-black whitespace-nowrap opacity-40 group-hover/item:opacity-100 transition-opacity">
                            {formatTime(msg.timestamp)}
                        </span>
                        <p>
                            <span className="text-white font-black mr-2 bg-white/5 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                               {msg.sender}
                            </span>{" "}
                            {msg.text}
                        </p>
                    </div>
                ))}
                {isProcessing && (
                    <div className="flex gap-4 animate-pulse opacity-50">
                        <span className="text-[#B6FF3B] font-black text-[10px] uppercase tracking-tighter italic">
                            Agent is typing...
                        </span>
                    </div>
                )}
            </>
        )}
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
