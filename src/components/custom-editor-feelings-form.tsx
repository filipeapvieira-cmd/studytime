"use client";

import { FC, ChangeEvent } from "react";
import CustomTextArea from "./ui/CustomTextArea";
import Title from "./custom-editor/title";
import EditorContainer from "./custom-editor/container";

interface CustomEditorFeelingsFormProps {
  sessionFeelings: string;
  setSessionFeelings: (sessionFeelings: string) => void;
}

const CustomEditorFeelingsForm: FC<CustomEditorFeelingsFormProps> = ({
  sessionFeelings,
  setSessionFeelings,
}) => {
  const handleFeelingsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSessionFeelings(e.target.value);
  };

  return (
    <EditorContainer className="mt-5 space-y-2">
      <Title title="Feelings" />
      <CustomTextArea
        value={sessionFeelings}
        onChange={(e) => handleFeelingsChange(e)}
      />
    </EditorContainer>
  );
};

export default CustomEditorFeelingsForm;
