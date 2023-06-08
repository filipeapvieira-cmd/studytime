"use client";

import { FC, useContext, useEffect, useState, useRef } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TimeContext } from "@/src/ctx/time-provider";

interface TimerProps {}

const Timer: FC<TimerProps> = ({}) => {
  const { sessionStartTime, setSessionStartTime } = useContext(TimeContext);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);

  // Create a ref to store the latest value of seconds
  const secondsRef = useRef(seconds);

  useEffect(() => {
    if (sessionStartTime > 0) {
      setSeconds(Math.floor((Date.now() - sessionStartTime) / 1000));
      setIsActive(true);
    }
    return () => {
      //setSessionDuration(secondsRef.current);
    };
  }, []);

  // Update the ref whenever seconds changes
  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  //update seconds when set to active
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
    if (!isActive && seconds === 0) {
      setSessionStartTime(Date.now());
    }
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
