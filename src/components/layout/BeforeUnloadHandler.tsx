"use client";

import { useTimeContext } from "@/src/ctx/time-provider";
import { useEffect } from "react";

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
