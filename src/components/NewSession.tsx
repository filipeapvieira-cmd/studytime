"use client";

import { Button } from "@/src/components/ui/button";
import { Icons } from "@/src/components/icons";
import Alert from "@/src/components/Alert";
import { retrieveTextFromJson } from "@/src/lib/utils";
import { useStudySession } from "@/src/hooks/useStudySession";

export const NewSessionBtn = () => {
  const { resetStudySession } = useStudySession();
  const { title, description } = retrieveTextFromJson("restartSession");

  const reStartSessionHandler = () => {
    resetStudySession();
  };

  return (
    <Alert
      title={title}
      description={description}
      action={reStartSessionHandler}
    >
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-full bg-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
      >
        <Icons.newSession />
      </Button>
    </Alert>
  );
};
