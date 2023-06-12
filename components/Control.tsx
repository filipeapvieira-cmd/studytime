import { FC } from "react";
import Timer from "./ui/Timer";
import { Icons } from "@/components/icons";
import Chrono from "./Chrono";
import NewSession from "./NewSession";
import StopSession from "./StopSession";

interface CounterProps {}

const Counter: FC<CounterProps> = ({}) => {
  return (
    <div
      className="container flex items-center justify-between border-border border-2
    p-6 rounded-lg"
    >
      <div className="space-x-2 flex">
        <Timer />
        <Chrono />
      </div>
      <div className="flex">
        <NewSession />
        <StopSession />
        <Icons.save />
      </div>
    </div>
  );
};

export default Counter;
