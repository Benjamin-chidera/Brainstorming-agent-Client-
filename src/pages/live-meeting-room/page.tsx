import { InviteAgents } from "@/components/live-room-meeting/Invite-agents";
import { AgentGroup } from "@/components/live-room-meeting/agent-group";
import { LiveTranscript } from "@/components/live-room-meeting/Live-transcript";
import { MeetingController } from "@/components/live-room-meeting/Meeting-controller";
import { TaskTracker } from "@/components/live-room-meeting/TaskTracker";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCouncilSetupStore } from "@/store/council-setup.store";
import { useMeetingStore } from "@/store/meeting.store";
import { socket } from "@/store/socket.io";

export default function LiveMeetingRoom() {
  const navigate = useNavigate();
  const { meetingId: urlId } = useParams();
  const { fetchCouncil } = useCouncilSetupStore();
  const { checkActiveMeeting, fetchMeetingDetails, meetingId, initSocketListeners } = useMeetingStore();

  useEffect(() => {
    const initializeRoom = async () => {
      await fetchCouncil();

      let isActive = false;
      if (urlId) {
        isActive = await fetchMeetingDetails(urlId);
      } else {
        isActive = await checkActiveMeeting();
      }

      if (!isActive) {
        navigate("/council-setup");
      }
    };

    initializeRoom();

    return () => {
      socket.off("chat_update");
      socket.off("agent_typing");
      socket.off("system_message");
      socket.off("meeting_ended");
    };
  }, [fetchCouncil, checkActiveMeeting, fetchMeetingDetails, navigate, urlId, meetingId, initSocketListeners]);

  return (
    <main className="2xl:container w-11/12 mx-auto pb-5">
      <section className="flex flex-wrap md:justify-between sm:justify-center items-start">
        <section className="flex justify-center lg:justify-start w-full lg:w-auto">
          <InviteAgents />
        </section>

        <section className="relative flex items-center justify-center min-h-[400px] mt-10 lg:mt-0">
          <AgentGroup />
        </section>

        <section className="flex justify-center w-full lg:w-auto">
          <TaskTracker />
        </section>
      </section>

      <section className="text-center md:mt-7">
        <section className="w-full flex justify-center">
          <LiveTranscript />
        </section>
        <section className="flex justify-center w-full lg:w-auto">
          <MeetingController />
        </section>
      </section>
    </main>
  );
}
