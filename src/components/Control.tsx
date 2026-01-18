import type { FC } from "react";
import Chrono from "./Chrono";
import { NewSessionBtn } from "./NewSession";
import { SaveSessionBtn } from "./SaveSession";
import { StopSessionBtn } from "./StopSession";
import Timer from "./ui/Timer";

type CounterProps = {};

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
