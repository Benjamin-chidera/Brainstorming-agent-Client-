import "./hero.css";
import { Dot, MoveRight } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <main className="2xl:container w-11/12 mx-auto md:flex items-start justify-between gap-10 lg:gap-20">
      <section className="flex flex-col pt-8 lg:pt-12">
        <div className="flex items-center w-fit py-1 pr-4 pl-1 bg-white/5 rounded-full backdrop-blur-3xl border border-white/10 glass">
          <Dot color="#B6FF3B" size={30} className="-mr-1 shrink-0" />
          <p className="text-[#B6FF3B] text-xs font-semibold whitespace-nowrap">
            Next-Gen AI Strategy
          </p>
        </div>

        <h1 className="font-bold text-4xl md:text-5xl text-white mt-6 leading-tight ">
          Build Your Own <br />
          <span className="text-[#B6FF3B]">
            AI Strategy <br />
            Team
          </span>
        </h1>

        <h3 className="text-xs  max-w-80  md:max-w-md md:text-sm text-[#8B949E] mt-3">
          Assemble a council of specialized AI agents to refine your vision,
          analyze risks, and execute your strategy with precision.
        </h3>

        <div className=" flex items-center gap-5 mt-10">
          <Button
            className="bg-[#B6FF3B] cursor-pointer font-bold text-[10px] md:text-sm text-[#0D1117] h-12.5 w-38 md:w-57.5 rounded-4xl hover:bg-[#B6FF3B]/90"
            onClick={() => navigate("/council-setup")}
          >
            Create Your Council <MoveRight color="#0D1117" size={30} />
          </Button>

          <Button className="cursor-pointer text-[10px] md:text-sm  font-bold h-12.5 w-28 md:w-30 bg-white-800 bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-90 rounded-4xl glass hover:bg-[#B6FF3B]/10 hover:text-[#B6FF3B] text-[#8B949E]">
            View Demo
          </Button>
        </div>
      </section>

      {/* hero image */}
      <section
        className="w-150 h-60 lg:w-160 lg:h-120 xl:h-160 bg-cover bg-center bg-no-repeat rounded-3xl hidden md:block"
        style={{ backgroundImage: "url('/hero.png')" }}
      ></section>
    </main>
  );
};
