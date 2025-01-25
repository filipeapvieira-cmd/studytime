import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function NoStudySessionsFound() {
  return (
    <Card className="w-full bg-[#1C1C1C] border-[#2A2A2A]">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
        <div className="rounded-full bg-[#2A2A2A] p-4">
          <Clock className="w-8 h-8 text-[#FFD700]" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-semibold text-white">
            No study sessions found
          </h3>
          <p className="text-sm text-gray-400">
            It looks like you haven&apos;t logged any sessions yet. Start by
            adding your first study session to track your progress!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
