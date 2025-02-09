"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Timer from "../ui/Timer";
import { NewSessionBtn } from "../NewSession";
import { StopSessionBtn } from "../StopSession";
import { SaveSessionBtn } from "../SaveSession";

interface SessionToolbarProps {
  className?: string;
}

export function SessionToolbar({ className }: SessionToolbarProps) {
  return (
    <div className={cn("w-full ", className)}>
      <div className="bg-black rounded-lg p-5 shadow-lg">
        <div className="mb-1">
          <p className="text-zinc-500 text-sm">Track your session</p>
        </div>
        <div className="flex items-center justify-between mt-3 mb-4">
          <Timer />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <NewSessionBtn />
          <StopSessionBtn />
          <SaveSessionBtn />
        </div>
      </div>
    </div>
  );
}
