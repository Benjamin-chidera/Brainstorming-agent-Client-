import React from "react";
import { Button } from "../ui/button";
import { Mic, Phone, Share, Video } from "lucide-react";

export const MeetingController = () => {
  return (
    <main className="glass p-2 md:p-4 rounded-full w-[350px] h-[70px] mt-2 mx-auto flex justify-between items-center">
      <section className=" flex items-center justify-between gap-3">
        <div>
          <Button className=" glass rounded-full h-9 w-9">
            <Video />
          </Button>

          <p className=" text-[7px] uppercase mt-1">Video</p>
        </div>

        <div>
          <Button className=" glass rounded-full h-9 w-9">
            <Mic />
          </Button>

          <p className=" text-[7px] uppercase mt-1">  Speak</p>
        </div>

        <div>
          <Button className=" glass rounded-full h-9 w-9">
            <Share />
          </Button>

          <p className=" text-[7px] uppercase mt-1">Share</p>
        </div>
      </section>

      <div className=" h-10 w-0.5 bg-gray-600 hidden md:block"></div>

      <section>
        <div>
          <Button className="bg-red-500 text-white font-bold hover:bg-red-600 cursor-pointer  h-10 rounded-full w-full">
            <Phone /> End Meeting
          </Button>
        </div>
      </section>
    </main>
  );
};
