import { FC } from "react";
import { Button } from "./button";
import { Icons } from "@/components/icons";

interface BtnTimerProps {
  onClick: () => void;
  status: string;
  effectiveTimeOfStudy: number;
  disabled: boolean;
  size?: "default" | "sm" | "lg";
}

const BtnTimer: FC<BtnTimerProps> = ({
  onClick,
  effectiveTimeOfStudy,
  status,
  disabled,
  size,
}) => {
  return (
    <Button
      variant="default"
      onClick={onClick}
      disabled={disabled}
      size={size || "default"}
    >
      {showIconForState(status)}
      <p className="text-lg w-[82px]">
        {new Date(effectiveTimeOfStudy).toISOString().slice(11, 19)}
      </p>
    </Button>
  );
};

export default BtnTimer;

const showIconForState = (state: string) => {
  if (state === "initial" || state === "pause") return <Icons.play />;
  if (state === "play") return <Icons.pause />;
  if (state === "stop") return <Icons.stop />;
  return null;
};
