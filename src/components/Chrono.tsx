"use client";

import { FC, useContext } from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  ChronoContext,
  chronoCtxDefaultValues,
} from "@/src/ctx/chrono-provider";
import { useTimeContext } from "@/src/ctx/time-provider";
import { Icons } from "@/src/components/icons";
import ChronoMenu from "./Chrono-menu";

interface ChronoProps {}

const Chrono: FC<ChronoProps> = ({}) => {
  const { sessionChrono, setSessionChrono } = useContext(ChronoContext);
  const {
    sessionTimer: { status },
  } = useTimeContext();
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
          variant="default"
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
