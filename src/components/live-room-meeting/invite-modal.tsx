import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMeetingStore } from "@/store/meeting.store";
import {
  Bot,
  Users,
  ChevronLeft,
  Link as LinkIcon,
  Twitter,
  Facebook,
  Linkedin,
  Rocket,
} from "lucide-react";
import { useCouncilSetupStore } from "@/store/council-setup.store";
import { AgentCard } from "../council-setup/agent-card";
import { MobileAgentCard } from "../council-setup/mobile-agent-card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export const InviteModal = () => {
  const { inviteModal, setInviteModal } = useMeetingStore();
  const { agents, setCouncilSize, summonCouncil, isCouncilCreated } =
    useCouncilSetupStore();

  const existingAgentsCount = agents.filter((a) => !a.isNew).length;
  const newAgents = agents.filter((a) => a.isNew);

  // Track which view we are in: 'ai' | 'team' | null (null = default selection screen)
  const [inviteType, setInviteType] = useState<"ai" | "team" | null>(null);

  const handleOpenAiInvite = () => {
    setInviteType("ai");
  };

  const handleSliderChange = (value: number[]) => {
    const newAmount = value[0];
    setCouncilSize(existingAgentsCount + newAmount);
  };

  const handleOpenChange = (open: boolean) => {
    setInviteModal(open);
    if (!open) {
      // Clean up new agents that weren't "summoned" if user closes modal? 
      // Actually maybe better to keep them in state if they started editing.
      // But user wanted it to start from 0.
      setTimeout(() => {
        setInviteType(null);
        // Reset to existing size if we were in AI invite mode
        setCouncilSize(existingAgentsCount);
      }, 300);
    }
  };

//   const hasNewAgents = agents.some((a) => a.isNew);

  return (
    <AlertDialog open={inviteModal} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="glass max-w-2xl max-h-[60vh] overflow-y-auto scrollbar-hide">
        {/* Back Button inside the modal, only visible if we are deep into a selection */}
        {inviteType && (
          <button
            onClick={() => {
              setInviteType(null);
              setCouncilSize(existingAgentsCount);
            }}
            className="absolute left-3 top-4 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <AlertDialogHeader>
          <AlertDialogTitle
            className={`text-lg text-white ${inviteType ? "text-center pt-10" : ""}`}
          >
            {inviteType === "ai"
              ? "Invite AI Agent"
              : inviteType === "team"
                ? "Invite Team Member"
                : "Expand Your Council"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-400 mt-3 text-left w-full h-full">
            {/* STAGE 1: DEFAULT SELECTION SCREEN */}
            {!inviteType && (
              <section className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
                <div
                  onClick={handleOpenAiInvite}
                  className="glass w-full md:h-[200px] p-5 rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:border-[#B6FF3B] cursor-pointer transition-colors"
                >
                  <div>
                    <div className="border border-white/20 w-fit p-2 rounded-full mb-3 text-white">
                      <Bot />
                    </div>

                    <h1 className="text-white font-bold mb-2">
                      Invite AI Agent
                    </h1>
                    <p className="text-gray-400 text-xs tracking-wider">
                      Add a new specialized intelligence to your strategic
                      council.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setInviteType("team")}
                  className="glass w-full md:h-[200px] p-5 rounded-2xl overflow-hidden border border-white/10 shadow-lg hover:border-[#B6FF3B] cursor-pointer transition-colors"
                >
                  <div>
                    <div className="border border-white/20 w-fit p-2 rounded-full mb-3 text-white">
                      <Users />
                    </div>

                    <h1 className="text-white font-bold mb-2">
                      Invite Team Member
                    </h1>
                    <p className="text-gray-400 text-xs tracking-wider">
                      Bring in a human colleague to collaborate in real-time.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* STAGE 2: AI AGENT SLIDER / CARDS VIEW */}
            {inviteType === "ai" && (
              <section className="">
                <div className="mb-8">
                  <div className="flex flex-col md:flex-row items-center gap-5 w-full justify-between glass p-5 rounded-2xl border border-white/10">
                    <div className="space-y-1">
                      <p className="font-semibold text-white">New Agents</p>
                      <p className="text-[10px] text-[#8B949E]">
                        Select how many agents to add.
                      </p>
                    </div>
                    <div className="flex-1 flex items-center justify-between md:justify-end gap-5 w-full">
                      <div className="w-full md:max-w-[200px]">
                        <Slider
                          value={[newAgents.length]}
                          onValueChange={handleSliderChange}
                          max={10 - existingAgentsCount}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <p className="font-bold text-2xl text-[#B6FF3B] shrink-0">
                        {newAgents.length}
                      </p>
                    </div>
                  </div>

                  {newAgents.length > 0 && (
                    <Button
                      className="bg-[#B6FF3B] text-[#0D1117] font-bold hover:bg-[#B6FF3B]/90 cursor-pointer mt-3"
                      onClick={summonCouncil}
                    >
                      {isCouncilCreated ? "Update Council" : "Create Council"}
                      <Rocket className="size-4 ml-1" />
                    </Button>
                  )}
                </div>

                {newAgents.length > 0 && (
                  <>
                    {/* Desktop view */}
                    <div className="hidden lg:grid gap-4 grid-cols-1 md:grid-cols-2 pb-6">
                      {newAgents.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} />
                      ))}
                    </div>
                    {/* Mobile view directly reusing your MobileAgentCard */}
                    <div className="lg:hidden w-full mx-auto pb-6">
                      <MobileAgentCard agents={newAgents} />
                    </div>
                  </>
                )}
              </section>
            )}

            {/* STAGE 2: TEAM MEMBER EMAIL INVITATION */}
            {inviteType === "team" && (
              <div className="mt-8 flex flex-col gap-6 pb-4">
                <div className="flex items-center gap-3 w-full">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="flex h-10 w-full rounded-md border border-white/10  px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#B6FF3B]/50"
                  />
                  <Button className="bg-[#B6FF3B] text-[#0D1117] font-bold hover:bg-[#B6FF3B]/90 cursor-pointer px-6">
                    Send
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 hover:text-[#B6FF3B] cursor-pointer bg-transparent"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Copy invitation link
                </Button>

                <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/10">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full hover:bg-[#1DA1F2]/20 text-gray-400 hover:text-[#1DA1F2] cursor-pointer glass transition-colors border border-white/5"
                  >
                    <Twitter className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full hover:bg-[#1877F2]/20 text-gray-400 hover:text-[#1877F2] cursor-pointer glass transition-colors border border-white/5"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full hover:bg-[#0A66C2]/20 text-gray-400 hover:text-[#0A66C2] cursor-pointer glass transition-colors border border-white/5"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!inviteType && (
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer text-white border-white/20 hover:bg-white/10 bg-transparent">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
