"use client";

import { SessionTextContext } from "@/src/ctx/session-text-provider";
import { FC, ChangeEvent, useContext } from "react";
import { Roboto } from "next/font/google";
import CustomTextArea from "./ui/CustomTextArea";

interface CustomEditorFeelingsFormProps {}

const CustomEditorFeelingsForm: FC<CustomEditorFeelingsFormProps> = ({}) => {
  const { sessionText: sessionFeelings, setSessionText: setSessionFeelings } =
    useContext(SessionTextContext);
  const handleFeelingsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSessionFeelings(e.target.value);
  };

  return (
    <div className="mt-5 space-y-2">
      <h1 className="font-heading text-foreground bg-background text-3xl text-center rounded-md p-2">
        Feelings
      </h1>
      <CustomTextArea
        value={sessionFeelings}
        onChange={(e) => handleFeelingsChange(e)}
      />
    </div>
  );
};

export default CustomEditorFeelingsForm;
