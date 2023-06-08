import { FC } from "react";
import { Icon } from "@/components/icons";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface TimerProps {
  //create a union type of the keys of Icons
  iconDescription: "play" | "pause" | "chrono";
}

const Timer: FC<TimerProps> = ({ iconDescription }) => {
  const SelectedIcon = Icons[iconDescription];
  return (
    <>
      <Button variant="ghost">
        <SelectedIcon />
        <p className="text-lg">00:00:00</p>
      </Button>
    </>
  );
};

export default Timer;
