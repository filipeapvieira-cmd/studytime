import { FC } from "react";
import Timer from "./ui/Timer";
import { Icons } from "@/src/components/icons";
import Chrono from "./Chrono";
import NewSession from "./NewSession";
import StopSession from "./StopSession";
import SaveSession from "./SaveSession";

interface CounterProps {}

const Counter: FC<CounterProps> = ({}) => {
  return (
    <div
      className="container flex items-center justify-between p-0
    py-6 rounded-lg"
    >
      <div className="space-x-2 flex">
        <Timer />
        <Chrono />
      </div>
      <div className="flex space-x-2">
        <NewSession />
        <StopSession />
        <SaveSession />
      </div>
    </div>
  );
};

export default Counter;
