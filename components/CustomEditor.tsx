"use client";
import { FC, useContext, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomEditorItem from "./CustomEditor-Item";
import { SaveSessionContext } from "@/ctx/save-session-provider";

interface CustomEditorProps {}

const CustomEditor: FC<CustomEditorProps> = ({}) => {
  const { sessions } = useContext(SaveSessionContext);
  console.log(sessions);
  return (
    <Accordion type="multiple" defaultValue={[String(0)]} className="w-1/2">
      {sessions.map((session, index) => (
        <AccordionItem value={String(index)} key={session.id} data-state="open">
          <CustomEditorItem position={index} session={session} />
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default CustomEditor;
