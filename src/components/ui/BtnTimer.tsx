import type { FC } from "react";
import { Icons } from "@/src/components/icons";
import { SessionStatusEnum } from "@/src/constants/config";
import { cn } from "@/src/lib/utils";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface BtnTimerProps {
  onClick: () => void;
  status: SessionStatusEnum;
  effectiveTimeOfStudy: number;
  disabled: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
}

const tooltipContent: Record<SessionStatusEnum, string> = {
  [SessionStatusEnum.Initial]: "Start your session",
  [SessionStatusEnum.Play]: "Pause your session",
  [SessionStatusEnum.Pause]: "Resume your session",
  [SessionStatusEnum.Stop]: "Your session has been stopped",
};

const BtnTimer: FC<BtnTimerProps> = ({
  onClick,
  effectiveTimeOfStudy,
  status,
  disabled,
  size,
  className,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="default"
            onClick={onClick}
            disabled={disabled}
            size={size || "default"}
            className={cn(
              "bg-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white flex-1 flex justify-between items-center",
              className,
            )}
          >
            {showIconForState(status)}
            <p className="text-lg w-[82px]">
              {new Date(effectiveTimeOfStudy).toISOString().slice(11, 19)}
            </p>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{tooltipContent[status]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BtnTimer;

const showIconForState = (state: string) => {
  if (state === "initial" || state === "pause") return <Icons.play />;
  if (state === "play") return <Icons.pause />;
  if (state === "stop") return <Icons.stop />;
  return null;
};
