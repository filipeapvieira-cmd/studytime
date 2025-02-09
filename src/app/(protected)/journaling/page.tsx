import { Metadata } from "next";
import { TopicSidebar } from "@/src/components/new-journaling/topic-sidebar";

export const metadata: Metadata = {
  title: "✅ Journaling...",
};

function JournalingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 flex-1 overflow-hidden md:min-w-[1000px]">
      <TopicSidebar />
    </div>
  );
}

export default JournalingPage;
