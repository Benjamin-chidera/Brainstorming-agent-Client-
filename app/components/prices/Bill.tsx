import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export const Bill = () => {
  //   const plans = [

  //     {
  //       id: "free",
  //       name: "Free",
  //       tagline: "Start exploring AI strategy",
  //       price: { monthly: 0, yearly: 0 },
  //       icon: Zap,
  //       color: "#94A3B8",
  //       glowColor: "rgba(148,163,184,0.15)",
  //       borderColor: "rgba(148,163,184,0.2)",
  //       cta: "Get Started Free",
  //       ctaVariant: "outline" as const,
  //       popular: false,
  //       features: [
  //         "Up to 2 AI agents",
  //         "3 sessions per day",
  //         "Basic strategy templates",
  //         "Community support",
  //         "Single workspace",
  //         "Export as PDF",
  //       ],
  //       limits: ["Limited session history", "No voice configuration"],
  //     },
  //     {
  //       id: "pro",
  //       name: "Pro",
  //       tagline: "Power your strategy with more agents",
  //       price: { monthly: 29, yearly: 23 },
  //       icon: Crown,
  //       color: "#7F0DF2",
  //       glowColor: "rgba(127,13,242,0.2)",
  //       borderColor: "rgba(127,13,242,0.4)",
  //       cta: "Start Pro Trial",
  //       ctaVariant: "default" as const,
  //       popular: true,
  //       features: [
  //         "5–10 AI agents",
  //         "Unlimited sessions",
  //         "Advanced personality presets",
  //         "Voice configuration",
  //         "Priority email support",
  //         "Full session history",
  //         "Export to Notion / PDF / MD",
  //         "Custom agent personas",
  //       ],
  //       limits: [],
  //     },
  //     {
  //       id: "team",
  //       name: "Team",
  //       tagline: "Collaborate across your entire org",
  //       price: { monthly: 79, yearly: 63 },
  //       icon: Users,
  //       color: "#10B981",
  //       glowColor: "rgba(16,185,129,0.15)",
  //       borderColor: "rgba(16,185,129,0.25)",
  //       cta: "Start Team Trial",
  //       ctaVariant: "outline" as const,
  //       popular: false,
  //       features: [
  //         "Unlimited AI agents",
  //         "Shared workspace",
  //         "Role-based access controls",
  //         "Team session history",
  //         "Real-time collaboration",
  //         "Custom integrations (API)",
  //         "Dedicated support manager",
  //         "SSO & advanced security",
  //         "White-label export",
  //       ],
  //       limits: [],
  //     },
  //   ];

  return (
    <main className=" my-10">
      <section>
        <Tabs defaultValue="overview" className="w-[400px] mx-auto">
          <TabsList className=" mx-auto glass space-x-2">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:text-white data-[state=active]:bg-[#7F0DF2]"
            >
              Monthly
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:text-white data-[state=active]:bg-[#7F0DF2]"
            >
              Yearly
            </TabsTrigger>
          </TabsList>

          <section className="flex items-center gap-5">
            {/* Monthly cards */}
            {/* Yearly cards */}
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    Track performance and user engagement metrics. Monitor
                    trends and identify growth opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Page views are up 25% compared to last month.
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    Track performance and user engagement metrics. Monitor
                    trends and identify growth opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Page views are up 25% compared to last month.
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    Track performance and user engagement metrics. Monitor
                    trends and identify growth opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Page views are up 25% compared to last month.
                </CardContent>
              </Card>
            </TabsContent>

            {/* Yearly cards */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Track performance and user engagement metrics. Monitor
                    trends and identify growth opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Page views are up 25% compared to last month.
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Track performance and user engagement metrics. Monitor
                    trends and identify growth opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Page views are up 25% compared to last month.
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Track performance and user engagement metrics. Monitor
                    trends and identify growth opportunities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm">
                  Page views are up 25% compared to last month.
                </CardContent>
              </Card>
            </TabsContent>
          </section>
        </Tabs>
      </section>
    </main>
  );
};
