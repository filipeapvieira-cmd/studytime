import { FC } from "react";
import { Button } from "./button";
import { Icons } from "@/components/icons";

interface BtnTimerProps {
  onClick: () => void;
  status: string;
  effectiveTimeOfStudy: number;
  disabled: boolean;
}

const BtnTimer: FC<BtnTimerProps> = ({
  onClick,
  effectiveTimeOfStudy,
  status,
  disabled,
}) => {
  return (
    <Button variant="default" onClick={onClick} disabled={disabled}>
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
