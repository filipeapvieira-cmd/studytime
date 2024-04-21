import { cn } from "@/lib/utils";
import React from "react";

type EditorContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export default function EditorContainer({
  children,
  className,
  ...props
}: Readonly<EditorContainerProps>) {
  const mergedClasses = cn("bg-primary/5 p-1 rounded-lg", className);

  return (
    <section className={mergedClasses} {...props}>
      {children}
    </section>
  );
}
