"use client";

import { FC, useContext } from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChronoContext } from "@/src/ctx/chrono-provider";
import { Icons } from "@/components/icons";
import ChronoMenu from "./Chrono-menu";

interface ChronoProps {}

const Chrono: FC<ChronoProps> = ({}) => {
  const { seconds, setSeconds, isActive, setIsActive } =
    useContext(ChronoContext);
  const btnRef = useRef<HTMLButtonElement>(null);

  const startHandler = (minutes: number) => {
    if (minutes > 0) {
      const seconds = minutes * 60;
      setSeconds(seconds);
      setIsActive(true);
    } else {
      setSeconds(0);
      setIsActive(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="" ref={btnRef}>
          <Icons.chrono />
          <p className="text-lg w-[82px]">
            {new Date(seconds * 1000).toISOString().slice(11, 19)}
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ChronoMenu
          isActive={isActive}
          closeBtnRef={btnRef}
          start={startHandler}
        />
      </PopoverContent>
    </Popover>
  );
};

export default Chrono;
