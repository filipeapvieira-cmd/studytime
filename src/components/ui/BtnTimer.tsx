import { FC } from "react";
import { Button } from "./button";
import { Icons } from "@/src/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { SessionStatusEnum } from "@/src/constants/config";

interface BtnTimerProps {
  onClick: () => void;
  status: SessionStatusEnum;
  effectiveTimeOfStudy: number;
  disabled: boolean;
  size?: "default" | "sm" | "lg";
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
            className="bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white flex-1 flex justify-between items-center"
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
