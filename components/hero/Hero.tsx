import React from "react";
import "./hero.css";
import { Dot, MoveRight } from "lucide-react";
import { Button } from "~/components/ui/button";

export const Hero = () => {
  return (
    <main className="w-[1232px] mx-auto flex items-start justify-between gap-10 lg:gap-20">
      <section className="flex flex-col pt-8 lg:pt-12">
        <div className="flex items-center w-fit py-1 pr-4 pl-1 bg-white/5 rounded-full backdrop-blur-3xl border border-white/10 glass">
          <Dot color="#7F0DF2" size={30} className="-mr-1 shrink-0" />
          <p className="text-[#7F0DF2] text-sm font-semibold whitespace-nowrap">
            Next-Gen AI Strategy
          </p>
        </div>

        <h1 className="font-bold text-[70px] text-white mt-6 leading-tight ">
          Build Your Own <br />
          <span className="text-[#7F0DF2]">
            AI Strategy <br />
            Team
          </span>
        </h1>

        <h3 className=" max-w-md text-lg text-[#94A3B8]">
          Assemble a council of specialized AI agents to refine your vision,
          analyze risks, and execute your strategy with precision.
        </h3>

        <div className=" flex items-center gap-5 mt-10">
          <Button className="bg-[#7F0DF2] cursor-pointer font-bold  h-[60px] w-[258px] rounded-4xl hover:bg-[#7F0DF2]/90">
            Create Your Council <MoveRight color="#fff" size={30} />
          </Button>

          <Button className="cursor-pointer font-bold h-[62px] w-[160px] bg-white-800 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-90 rounded-4xl glass hover:bg-[#7F0DF2]/90">
            View Demo
          </Button>
        </div>
      </section>

      {/* hero image */}
      <section
        className="w-[804px] h-[600px] bg-cover bg-center bg-no-repeat rounded-3xl"
        style={{ backgroundImage: "url('/hero.png')" }}
      ></section>
    </main>
  );
};
