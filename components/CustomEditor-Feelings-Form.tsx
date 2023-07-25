"use client";

import { SessionTextContext } from "@/src/ctx/session-text-provider";
import { FC, ChangeEvent, useContext } from "react";

interface CustomEditorFeelingsFormProps {}

const CustomEditorFeelingsForm: FC<CustomEditorFeelingsFormProps> = ({}) => {
  const { sessionText: sessionFeelings, setSessionText: setSessionFeelings } =
    useContext(SessionTextContext);
  const handleFeelingsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSessionFeelings(e.target.value);
  };

  return (
    <div>
      <h1>Feelings</h1>
      <textarea
        rows={10}
        className="w-full"
        value={sessionFeelings}
        onChange={(e) => handleFeelingsChange(e)}
      />
    </div>
  );
};

export default CustomEditorFeelingsForm;
