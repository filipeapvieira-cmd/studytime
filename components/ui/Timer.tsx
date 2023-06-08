"use client";

import { FC, useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface TimerProps {}

const Timer: FC<TimerProps> = ({}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timer;
    interval = setInterval(() => {
      if (isActive) {
        setSeconds((seconds) => seconds + 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  const handleState = () => {
    setIsActive((state) => !state);
  };

  return (
    <>
      <Button variant="ghost" onClick={handleState} className="">
        {!isActive ? <Icons.play /> : <Icons.pause />}
        <p className="text-lg w-[82px]">
          {new Date(seconds * 1000).toISOString().slice(11, 19)}
        </p>
      </Button>
    </>
  );
};

export default Timer;
