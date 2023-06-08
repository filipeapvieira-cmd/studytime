import { FC } from "react";
import Timer from "./ui/Timer";
import { Icons } from "@/components/icons";
import Chrono from "./Chrono";

interface CounterProps {}

const Counter: FC<CounterProps> = ({}) => {
  return (
    <div
      className="flex items-center justify-between border-border border-2
    p-6 rounded-lg"
    >
      <div className="space-x-2 flex">
        <Timer />
        <Chrono />
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
