import { Hero } from "components/hero/Hero";
import type { Route } from "./+types/_index";
import { Check, CheckCircle, Dot } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const macrketText = [
    "Market risk assessment",
    "Revenue projections synced",
    "Technical debt minimized",
  ];

  return (
    <main>
      <section>
        <Hero />
      </section>

      <section className="glass w-11/12 lg:w-4xl h-66.75 rounded-xl mx-auto mt-20 relative">
        <div className="h-10.5 md:px-10 px-3 mx-auto flex items-center justify-between pt-8">
          <div className="flex items-center gap-4">
            <div>
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="48"
                  height="48"
                  rx="24"
                  fill="#7F0DF2"
                  fillOpacity="0.2"
                />
                <path
                  d="M19 30V18H21V30H19ZM23 34V14H25V34H23ZM15 26V22H17V26H15ZM27 30V18H29V30H27ZM31 26V22H33V26H31Z"
                  fill="#7F0DF2"
                />
              </svg>
            </div>
            <div>
              <p className="md:text-sm text-xs font-semibold whitespace-nowrap">
                Council Feedback Loop{" "}
              </p>
              <p className="md:text-sm text-[10px]  text-[#94A3B8] whitespace-nowrap">
                Processing active strategy session...{" "}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-0">
            <Dot size={40} color="#10B981" />
            <p className="md:text-xs hidden md:block whitespace-nowrap text-[#10B981]">
              Live Analysis
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 w-full px-8">
          <div className="bg-[#FFFFFF] opacity-15 w-full h-0.5 mx-auto" />

          <div className="flex flex-wrap gap-3 items-center justify-between pt-6">
            {macrketText.map((text, index) => (
              <div key={index} className="flex items-center gap-4">
                <CheckCircle size={20} color="#10B981" />
                <p className="md:text-xs text-[8px] whitespace-nowrap text-[#10B981]">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
