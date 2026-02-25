import React from "react";
import type { Route } from "./+types/route";
import { MultiAgentSection } from "~/components/about/multi-agent-section";
import { BottleNeckOfAI } from "~/components/about/bottle-neck-ai";
import { CeoPic } from "~/components/about/team-pic";
import { CouncilRoadmap } from "~/components/about/council-roadmap";
import { Ethics } from "~/components/about/ethics";

export function meta({}: Route.MetaArgs) {
  return [{ title: "About" }, { name: "description", content: "About page" }];
}

export default function About() {
  return (
    <main>
      <section className="mt-10">
        <div className="glass w-55 h-8.5 rounded-full flex items-center justify-center gap-2 mx-auto text-[#7F0DF2] font-semibold uppercase">
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 4.6667L9.77083 3.06253L8.16667 2.33336L9.77083 1.6042L10.5 3.05176e-05L11.2292 1.6042L12.8333 2.33336L11.2292 3.06253L10.5 4.6667V4.6667M10.5 12.8334L9.77083 11.2292L8.16667 10.5L9.77083 9.77086L10.5 8.1667L11.2292 9.77086L12.8333 10.5L11.2292 11.2292L10.5 12.8334V12.8334M4.66667 11.0834L3.20833 7.87503L0 6.4167L3.20833 4.95836L4.66667 1.75003L6.125 4.95836L9.33333 6.4167L6.125 7.87503L4.66667 11.0834V11.0834M4.66667 8.2542L5.25 7.00003L6.50417 6.4167L5.25 5.83336L4.66667 4.5792L4.08333 5.83336L2.82917 6.4167L4.08333 7.00003L4.66667 8.2542V8.2542M4.66667 6.4167V6.4167V6.4167V6.4167V6.4167V6.4167V6.4167V6.4167V6.4167V6.4167"
              fill="#7F0DF2"
            />
          </svg>

          <p className=" text-xs">The Future of Strategy</p>
        </div>

        <section className="2xl:container w-11/12 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold max-w-xl lg:max-w-4xl mx-auto text-center mt-10">
            Democratizing Strategy Through{" "}
            <span className="text-[#7F0DF2]">Collective Intelligence</span>
          </h1>

          <p className="text-xs md:text-sm text-[#94A3B8] max-w-sm lg:max-w-xl mx-auto text-center mt-10">
            In the past, strategic planning was the exclusive domain of
            expensive consulting firms and senior executives. We’re changing
            that. By leveraging a distributed network of specialized AI agents,
            we’ve created a platform that makes world-class strategic analysis
            accessible to everyone.
          </p>
        </section>
      </section>
      <div className="2xl:container w-11/12 mx-auto">
        <MultiAgentSection />
      </div>
      {/* bottle neck of ai */}
      <div>
        <BottleNeckOfAI />
      </div>

      <div>
        <CeoPic />
      </div>

      <div>
        <CouncilRoadmap />
      </div>

      <div>
        <Ethics />
      </div>
    </main>
  );
}
