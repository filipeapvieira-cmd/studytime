"use client";

import { FC, useContext, useEffect, useState, useRef } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { TimeContext } from "@/src/ctx/time-provider";

const Timer = () => {
  const { sessionTimer, setSessionTimer } = useContext(TimeContext);
  const { currentTimeOfStudy, status } = sessionTimer;

  const handleState = () => {
    if (status === "initial") {
      setSessionTimer((prevState) => ({ ...prevState, status: "play" }));
    } else if (status === "play") {
      setSessionTimer((prevState) => ({ ...prevState, status: "pause" }));
    } else if (status === "pause") {
      setSessionTimer((prevState) => ({ ...prevState, status: "play" }));
    }
  };

  return (
    <>
      <Button
        variant="default"
        onClick={handleState}
        disabled={status === "stop"}
      >
        {showIconForState(status)}
        <p className="text-lg w-[82px]">
          {new Date(currentTimeOfStudy * 1000).toISOString().slice(11, 19)}
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
