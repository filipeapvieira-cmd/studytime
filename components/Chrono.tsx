"use client";

import { FC } from "react";
import { useState, useRef } from "react";
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
        <ChronoMenu isActive={isActive} closeBtnRef={btnRef} />
      </PopoverContent>
    </Popover>
  );
};

export default Chrono;
