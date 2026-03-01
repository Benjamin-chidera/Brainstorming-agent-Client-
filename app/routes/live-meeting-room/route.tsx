import type { Route } from "./+types/route";

export function meta({}: Route.MetaArgs) {
    return [{ title: "About" }, { name: "description", content: "About page" }];
  }

export default function LiveMeetingRoom() {
  return (
    <main className="2xl:container w-11/12 mx-auto">
      <div>
        <h1>Live Meeting Room</h1>
      </div>
    </main>
  );
}