import { InviteAgents } from "@/components/live-room-meeting/Invite-agents";
import { AgentGroup } from "@/components/live-room-meeting/agent-group";
import { LiveTranscript } from "@/components/live-room-meeting/Live-transcript";
import { MeetingController } from "@/components/live-room-meeting/Meeting-controller";
import { TaskTracker } from "@/components/live-room-meeting/TaskTracker";

export default function LiveMeetingRoom() {
  return (
    <main className="2xl:container w-full px-4 lg:w-11/12 mx-auto">
      <section className="grid grid-cols-1 lg:grid-cols-[1.5fr_3fr_1.5fr] gap-8 items-start w-full">
        <section className="flex justify-center lg:justify-start">
          <InviteAgents />
        </section>

        <section className="relative flex items-center justify-center min-h-[400px]">
          <AgentGroup />
        </section>

        <section className="flex justify-center lg:justify-end">
          <TaskTracker />
        </section>
      </section>

      <section className="text-center md:mt-7">
        <section className="w-full flex justify-center">
          <LiveTranscript />
        </section>
        <section className="w-full flex justify-center">
          <MeetingController />
        </section>
      </section>
    </main>
  );
}
