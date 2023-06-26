"use client";

import { FC, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import { retrieveTextFromJson } from "@/lib/utils";
import { useStudySession } from "@/src/hooks/useStudySession";

interface NewSessionProps {}

const NewSession: FC<NewSessionProps> = ({}) => {
  //console.count("NewSession");
  const { resetStudySession } = useStudySession();
  const { title, description } = retrieveTextFromJson("restartSession");

  // set default values
  const reStartSessionHandler = () => {
    resetStudySession();
  };

  return (
    <Alert
      title={title}
      description={description}
      action={reStartSessionHandler}
    >
      <Button variant="default">
        <Icons.newSession />
      </Button>
    </Alert>
  );
};

export default NewSession;
