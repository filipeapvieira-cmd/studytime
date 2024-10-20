import React from "react";
import { Icons } from "../icons";

type HeaderProps = {
  label: string;
};

export default function Header({ label }: HeaderProps) {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <div className="flex flex-col justify-center items-center">
        <Icons.Logo size={70} />
        <h1 className="text-3xl font-semibold ">Study Time</h1>
      </div>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
