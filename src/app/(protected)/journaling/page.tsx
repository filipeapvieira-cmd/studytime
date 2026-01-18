import type { Metadata } from "next";
import { TopicSidebar } from "@/src/components/new-journaling/topic-sidebar";

export const metadata: Metadata = {
  title: "✅ Journaling...",
};

function JournalingPage() {
  return (
    <div className="px-4 flex-1 overflow-hidden max-w-6xl md:min-w-[1000px] w-4/5 mx-auto">
      <TopicSidebar />
    </div>
  );
}

export default JournalingPage;
