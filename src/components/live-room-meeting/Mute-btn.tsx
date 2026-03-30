import { Button } from "../ui/button";
import { MicOff } from "lucide-react";

export const MuteBtn = () => {
  return (
    <main>
      {" "}
      <Button className=" bg-transparent hover:bg-transparent border border-white/10 rounded-full">
        <MicOff size={15} />
        {/* <MicIcon  size={15}/> */}
      </Button>
    </main>
  );
};
