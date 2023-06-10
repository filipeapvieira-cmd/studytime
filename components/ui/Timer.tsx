"use client";

import { FC, useContext, useEffect, useState, useRef } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TimeContext } from "@/src/ctx/time-provider";

interface TimerProps {}

const Timer: FC<TimerProps> = ({}) => {
  const { sessionTimer, setSessionTimer } = useContext(TimeContext);
  const [seconds, setSeconds] = useState<number>(
    sessionTimer.currentTimeOfStudy
  );
  const [state, setState] = useState(sessionTimer.status);

  // Create a ref to store the latest value of seconds and state
  const secondsRef = useRef(seconds);
  const stateRef = useRef(state);

  useEffect(() => {
    if (seconds > 0 && state === "play") {
      setSeconds(
        Math.floor((Date.now() - sessionTimer.lastUpdate) / 1000) + seconds
      );
    }

    return () => {
      setSessionTimer({
        currentTimeOfStudy: secondsRef.current,
        // eslint disabled because I want to capture the most up to date state and not the state when the component was rendered
        // eslint-disable-next-line react-hooks/exhaustive-deps
        status: stateRef.current,
        lastUpdate: Date.now(),
      });
    };
  }, []);

  // Update the ref whenever seconds changes
  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  //update seconds when set to active
  useEffect(() => {
    let interval: NodeJS.Timer;
    stateRef.current = state;

    if (state === "initial" || state === "pause" || state === "stop") {
      return;
    }

    interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [state]);

  const handleState = () => {
    if (state === "initial") {
      setState("play");
    } else if (state === "play") {
      setState("pause");
    } else if (state === "pause") {
      setState("play");
    }
  };

  return (
    <>
      <Button variant="ghost" onClick={handleState} className="">
        {showIconForState(state)}
        <p className="text-lg w-[82px]">
          {new Date(seconds * 1000).toISOString().slice(11, 19)}
        </p>
      </Button>
    </>
  );
};

const showIconForState = (state: string) => {
  if (state === "initial" || state === "pause") return <Icons.play />;
  if (state === "play") return <Icons.pause />;
  if (state === "stop") return <Icons.stop />;
  return null;
};

export default Timer;
