"use client";

import { useEffect } from "react";
import UnexpectedEvent from "@/src/components/Unexpected-Event";

export default function Error({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const unexpectedEventConfig = {
    header: "Something went wrong!",
    message: "An unexpected error occurred. Please try again.",
    onClick: reset,
  };

  return (
    <div className="container mx-auto">
      <UnexpectedEvent config={unexpectedEventConfig} />
    </div>
  );
}
