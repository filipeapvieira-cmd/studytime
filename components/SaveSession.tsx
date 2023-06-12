"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import Alert from "@/components/Alert";
import { retrieveText } from "@/lib/utils";

interface SaveSessionProps {}

const SaveSession: FC<SaveSessionProps> = ({}) => {
  const { title, description } = retrieveText("restartSession");

  return (
    <Alert title={title} description={description}>
      <Button variant="ghost">
        <Icons.save />
      </Button>
    </Alert>
  );
};

export default SaveSession;
