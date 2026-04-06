import { useMeetingStore } from "@/store/meeting.store";
import { Mic, Phone, Share, Video, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export const MeetingController = () => {
  const { userMessage, setUserMessage, sendMessage, endMeeting } = useMeetingStore();

  const handleSend = () => {
    if (userMessage.trim()) {
      sendMessage(userMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <main className="flex flex-col items-center gap-3 mt-2 mx-auto w-full max-w-lg px-4">

      {/* Mini user input */}
      <div className="glass w-full flex items-center px-4 py-2 rounded-full border border-white/10 group focus-within:border-[#B6FF3B]/30 transition-all duration-300">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Transmit a message to the council..."
          className="flex-1 bg-transparent text-xs text-white placeholder:text-gray-500 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className={cn(
            "p-1.5 rounded-full transition-all duration-300",
            userMessage.trim() 
              ? "bg-[#B6FF3B] text-[#0D1117] cursor-pointer" 
              : "bg-white/5 text-gray-600 cursor-not-allowed"
          )}
        >
          <Send className="size-3" />
        </button>
      </div>

      {/* Main meeting controls */}
      <div className="glass p-2 md:p-4 rounded-full w-[350px] h-[70px] flex justify-between items-center bg-black/40 backdrop-blur-xl">
        <section className=" flex items-center justify-between gap-3">
          <div>
            <Button className=" glass rounded-full h-9 w-9" disabled>
              <Video />
            </Button>
            <p className=" text-[7px] uppercase mt-1 text-white text-center">Video</p>
          </div>

          <div>
            <Button className=" glass rounded-full h-9 w-9">
              <Mic />
            </Button>
            <p className=" text-[7px] uppercase mt-1 text-white text-center"> Speak</p>
          </div>

          <div>
            <Button className=" glass rounded-full h-9 w-9" disabled>
              <Share />
            </Button>
            <p className=" text-[7px] uppercase mt-1 text-white text-center">Share</p>
          </div>
        </section>

        <div className=" h-10 w-0.5 bg-gray-600 hidden md:block"></div>

        <section>
          <div>
            <Button 
              onClick={() => endMeeting()}
              className="bg-red-500 text-white font-bold hover:bg-red-600 cursor-pointer  h-10 rounded-full w-full"
            >
              <Phone /> End Meeting
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};
