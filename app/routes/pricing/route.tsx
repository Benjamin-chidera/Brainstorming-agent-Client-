import { useState } from "react";
import type { Route } from "./+types/route";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { Bill } from "~/components/prices/Bill";
import { FAQComponent } from "~/components/prices/FAQ";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Pricing – Council.ai" },
    {
      name: "description",
      content:
        "Choose the plan that fits your team. From solo explorations to enterprise strategy rooms.",
    },
  ];
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="2xl:container w-11/12 mx-auto text-white overflow-x-hidden">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #7F0DF2 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #10B981 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 pb-24">
        {/* Header */}
        <div className="text-center px-4 max-w-3xl mx-auto mt-10">
          <div className="glass w-fit px-3 h-8 rounded-full flex items-center justify-center gap-2 text-[#7F0DF2] font-semibold uppercase mt-10 mx-auto">
            <Sparkles size={14} className="text-[#7F0DF2]" />
            <span className="text-xs font-semibold text-[#7F0DF2]">
              Pricing
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mt-6">
            Choose the perfect plan for your
            <span className="text-[#7F0DF2]"> AI journey</span>
            <br />
            Council Plan
          </h1>
          <p className="text-[#94A3B8] text-xs md:text-sm max-w-xl mx-auto mt-4">
            From solo explorations to full enterprise strategy rooms — find the
            plan that scales with your ambition.
          </p>

          {/* Billing toggle */}

          <div>
            <Bill />
          </div>
        </div>

        {/* Pricing cards */}

        {/* FAQ */}
        <FAQComponent />

        {/* Bottom CTA banner */}
      </div>
    </main>
  );
}
