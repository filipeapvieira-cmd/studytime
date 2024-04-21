import React from "react";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";

type AuthContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export default function AuthContainer({
  children,
  className,
  ...props
}: Readonly<AuthContainerProps>) {
  const mergedClasses = cn(
    "flex flex-col items-center justify-center rounded-md shadow-md border-border bg-secondary/90 overflow-hidden w-[300px]",
    className
  );
  return (
    <div className={mergedClasses} {...props}>
      <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground w-full flex-1">
        <Icons.Logo size={70} />
        <p className="text-3xl">Study Time</p>
      </div>
      {children}
    </div>
  );
}
