"use client";

import UnexpectedEvent from "@/src/components/Unexpected-Event";
import { useEffect } from "react";

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
