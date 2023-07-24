"use client";

import { FC, useContext, ChangeEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SessionReport } from "@/types";
import { SaveSessionContext } from "@/ctx/save-session-provider";
import { createNewSession } from "@/ctx/save-session-provider";

interface CustomEditorFormProps {
  session: SessionReport;
}

const CustomEditorForm: FC<CustomEditorFormProps> = ({
  session,
}: CustomEditorFormProps) => {
  const { setSessions } = useContext(SaveSessionContext);

  const handleNewTopic = () => {
    setSessions((prevValue: SessionReport[]) => [
      ...prevValue,
      createNewSession(),
    ]);
  };

  const handleDeleteTopic = () => {
    setSessions((prevValue: SessionReport[]) =>
      prevValue.filter((currentSession) => currentSession.id !== session.id)
    );
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Get session from array
    // Replace it with new updated object on the same index
    // Dispatch
    console.log(e);
  };

  return (
    <>
      <form>
        <div className="flex">
          <Input
            placeholder="Subject"
            value={session.topic}
            onChange={(e) => handleInputChange(e)}
          />
          <Input placeholder="Hashtags" value={session.hashtags} />
        </div>
        <textarea rows={10} className="w-full" value={session.description} />
      </form>
      <Button onClick={handleNewTopic}>New Topic</Button>
      <Button onClick={handleDeleteTopic}>Delete</Button>
    </>
  );
};

export default CustomEditorForm;
