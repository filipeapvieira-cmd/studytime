import { FC } from "react";
import Timer from "./ui/Timer";
import { Icons } from "@/components/icons";

interface CounterProps {}

const Counter: FC<CounterProps> = ({}) => {
  return (
    <div
      className="flex items-center justify-around border-border border-2
    p-6 rounded-lg"
    >
      <div className="space-x-2 flex">
        <Timer iconDescription="play" />
        <Timer iconDescription="pause" />
        <Timer iconDescription="chrono" />
      </div>
      <div className="flex">
        <Icons.newSession />
        <Icons.stop />
        <Icons.save />
      </div>
    </div>
  );
};

export default Counter;
