import { Button } from "../ui/button";
import { MicOff } from "lucide-react";

export const MuteBtn = () => {
  return (
    <main>
      {" "}
      <Button className=" bg-transparent hover:bg-transparent">
        <MicOff size={15} />
        {/* <MicIcon  size={15}/> */}
      </Button>
    </main>
  );
};
