"use client";

import { FC, useContext } from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChronoContext,
  chronoCtxDefaultValues,
} from "@/src/ctx/chrono-provider";
import { TimeContext } from "@/src/ctx/time-provider";
import { Icons } from "@/components/icons";
import ChronoMenu from "./Chrono-menu";

interface ChronoProps {}

const Chrono: FC<ChronoProps> = ({}) => {
  const { sessionChrono, setSessionChrono } = useContext(ChronoContext);
  const {
    sessionTimer: { status },
  } = useContext(TimeContext);
  const btnRef = useRef<HTMLButtonElement>(null);

  const startHandler = (minutes: number) => {
    if (minutes > 0) {
      const seconds = minutes * 60;
      setSessionChrono({ seconds, isActive: true });
    } else {
      setSessionChrono(chronoCtxDefaultValues.sessionChrono);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className=""
          ref={btnRef}
          disabled={status === "stop"}
        >
          <Icons.chrono />
          <p className="text-lg w-[82px]">
            {new Date(sessionChrono.seconds * 1000).toISOString().slice(11, 19)}
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ChronoMenu closeBtnRef={btnRef} start={startHandler} />
      </PopoverContent>
    </Popover>
  );
};

export default Chrono;
