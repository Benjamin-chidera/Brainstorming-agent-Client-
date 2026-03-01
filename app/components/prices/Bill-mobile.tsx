import { Ban, CheckCircle, Crown, Users, Zap } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "../ui/button";
import { useBillStore } from "store/bill.store";


export const BillMobile = () => {
  const {switcher, setSwitcher} = useBillStore()

    const plans = [

      {
        id: "free",
        name: "Free",
        tagline: "Perfect for individuals exploring AI agents.",
        price: { monthly: 0, yearly: 0 },
        icon: Zap,
        color: "#94A3B8",
        glowColor: "rgba(148,163,184,0.15)",
        borderColor: "rgba(148,163,184,0.2)",
        cta: "Get Started Free",
        ctaVariant: "outline" as const,
        features: [
          "2 AI agents",
          "10 sessions per month",
          "Community support",
        ],
        limits: ["Limited session history", "No advanced features"],
      },

      {
        id: "pro",
        name: "Pro",
        tagline: "Perfect for teams and organizations.",
        price: { monthly: 29, yearly: 23 },
        icon: Crown,
        color: "#7F0DF2",
        glowColor: "rgba(127,13,242,0.15)",
        borderColor: "rgba(127,13,242,0.2)",
        cta: "Get Started with Pro",
        ctaVariant: "outline" as const,
        features: [
          "5 AI agents",
          "Unlimited sessions per month",
          "Role-based access controls",
          "Team session history",
          "Real-time collaboration",
        ],
        limits: [],
      },

      {
        id: "team",
        name: "Team",
        tagline: "Collaborate across your entire org",
        price: { monthly: 79, yearly: 63 },
        icon: Users,
        color: "#10B981",
        glowColor: "rgba(16,185,129,0.15)",
        borderColor: "rgba(16,185,129,0.25)",
          cta: "Get Started with Team",
        ctaVariant: "outline" as const,
        popular: false,
        features: [
          "Unlimited AI agents",
          "Shared workspace",
          "Role-based access controls",
          "Team session history",
          "Real-time collaboration",
          "Custom integrations (API)",
          "Dedicated support manager",
          "SSO & advanced security",
          "White-label export",
        ],
        limits: [],
      },
    ];

  return (
    <main className=" my-10">
      <section>
        <Tabs defaultValue="monthly" className="w-[400px] mx-auto">
          <TabsList className=" mx-auto glass space-x-2">
            <TabsTrigger
              value="monthly"
              className="data-[state=active]:text-white data-[state=active]:bg-[#7F0DF2]"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="yearly"
              className="data-[state=active]:text-white data-[state=active]:bg-[#7F0DF2]"
            >
              Yearly
            </TabsTrigger>
          </TabsList>

{/* large screen */}

          <section className="hidden lg:flex items-center gap-5 justify-center mt-10">
            {/* Monthly cards */}
            {plans.map((plan) => (
              <TabsContent value={"monthly"} key={plan.id}>
                <Card className="p-3 glass w-[300px] h-[450px]">
                  <CardHeader>
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h1 className="text-white text-3xl font-bold">{plan.price.monthly}<span className="text-muted-foreground text-[10px]">/monthly</span></h1>
                    <p className="text-muted-foreground text-[10px] mt-2">{plan.tagline}</p>

                    <Button className="w-full mt-4 bg-[#7F0DF2] text-white rounded-full">{plan.cta}</Button>
                  
                  <ul className="mt-7 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-muted-foreground text-[10px] text-start space-y-2 flex items-center gap-2 ">
                        <CheckCircle
                          size={12}
                          color="#7F0DF2"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-2 space-y-2">
                    {plan.limits.map((limit) => (
                      <li key={limit} className="text-muted-foreground text-[10px] text-start space-y-2 flex items-center gap-2">
                        <Ban size={12} color="#7F0DF2" />
                        {limit}</li>
                    ))}
                  </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
         

            {/* Yearly cards */}
            {plans.map((plan) => (
                <TabsContent value={"yearly"} key={plan.id}>
                <Card className="p-3 glass w-[300px] h-[450px]">
                  <CardHeader>
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h1 className="text-white text-3xl font-bold">{Math.round(plan.price.yearly * 0.85)}<span className="text-muted-foreground text-[10px]">/monthly</span></h1>
                    <p className="text-muted-foreground text-[10px] mt-2">{plan.tagline}</p>

                    <Button className="w-full mt-4 bg-[#7F0DF2] text-white rounded-full">{plan.cta}</Button>
                  
                  <ul className="mt-7 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="text-muted-foreground text-[10px] text-start space-y-2 flex items-center gap-2 ">
                        <CheckCircle
                          size={12}
                          color="#7F0DF2"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-2 space-y-2">
                    {plan.limits.map((limit) => (
                      <li key={limit} className="text-muted-foreground text-[10px] text-start space-y-2 flex items-center gap-2">
                        <Ban size={12} color="#7F0DF2" />
                        {limit}</li>
                    ))}
                  </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </section>
    </Tabs>
  </section>

  {/* controllers */}
  <section className=" flex justify-center items-center mt-10 gap-5">
    <div>
      <Button className=" bg-[#7F0DF2] text-white w-30 py-2 font-bold" onClick={() => setSwitcher("free")}>Free</Button>
    </div>
    <div>
      <Button className=" bg-[#7F0DF2] text-white w-30 py-2 font-bold" onClick={() => setSwitcher("pro")}>Pro</Button>
    </div>
    <div>
      <Button className=" bg-[#7F0DF2] text-white w-30 py-2 font-bold" onClick={() => setSwitcher("team")}>Team</Button>
    </div>
  </section>
</main>
);
};
