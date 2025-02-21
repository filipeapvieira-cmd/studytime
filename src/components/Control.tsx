import { FC } from "react";
import Timer from "./ui/Timer";
import Chrono from "./Chrono";
import { NewSessionBtn } from "./NewSession";
import { StopSessionBtn } from "./StopSession";
import { SaveSessionBtn } from "./SaveSession";

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
        <NewSessionBtn />
        <StopSessionBtn />
        <SaveSessionBtn />
      </div>
    </div>
  );
};

export default Counter;
