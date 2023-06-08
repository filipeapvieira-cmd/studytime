"use client";

import { FC } from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Icons } from "@/components/icons";
import ChronoMenu from "./Chrono-menu";

interface ChronoProps {}

const Chrono: FC<ChronoProps> = ({}) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => {
          if (seconds === 0) {
            showDesktopNotification();
            setIsActive(false);
            return 0;
          }
          return seconds - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

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

  // TODO: Needs improvement
  const showDesktopNotification = () => {
    new Notification("Hello World");
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
