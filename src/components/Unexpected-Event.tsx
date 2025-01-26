import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";

type UnexpectedEventProps = {
  config: {
    header: string;
    message: string;
    onClick?: () => void;
  };
};

export default function UnexpectedEvent({ config }: UnexpectedEventProps) {
  const { header, message, onClick } = config;
  return (
    <Card className="w-full bg-[#1C1C1C] border-[#2A2A2A]">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-4">
        <div className="rounded-full bg-[#2A2A2A] p-4">
          <Clock className="w-8 h-8 text-[#FFD700]" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-xl font-semibold text-white">{header}</h3>
          <p className="text-sm text-gray-400">{message}</p>
        </div>
        {onClick && (
          <Button
            onClick={onClick}
            className="mt-4 px-4 py-2 bg-[#FFD700] text-[#1C1C1C] rounded hover:bg-[#e0c100] transition-colors duration-200"
          >
            Retry
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
