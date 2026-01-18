"use client";

import { useEffect } from "react";
import { useTimeContext } from "@/src/ctx/time-provider";

const BeforeUnloadHandler: React.FC = () => {
  const { status } = useTimeContext();

  useEffect(() => {
    if (status === "initial") {
      return;
    }
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const message =
        "You have unsaved changes! Are you sure you want to leave?";
      e.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [status]);

  return null;
};

export default BeforeUnloadHandler;
