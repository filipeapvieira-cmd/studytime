"use client";
import { FC, useContext, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomEditorItem from "./CustomEditor-Item";
import { SaveSessionContext } from "@/ctx/save-session-provider";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/components/skeletons/EditorSkeleton";
import { SessionReport } from "@/types";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

interface CustomEditorProps {}

const CustomEditor: FC<CustomEditorProps> = ({}) => {
  const { sessions } = useContext(SaveSessionContext);
  const [indexToShow, setIndexToShow] = useState(sessions.length - 1);

  useEffect(() => {
    setIndexToShow(sessions.length - 1);
  }, [sessions.length]);

  console.log(sessions);
  //console.log(getElementHeightById("customEditorContainer"));
  return (
    <div className="flex">
      <Accordion
        type="multiple"
        value={[String(indexToShow)]}
        className="flex-1 self-start"
        //id="customEditorContainer"
      >
        {sessions.map((session, index) => (
          <AccordionItem
            value={String(index)}
            key={session.id}
            data-state="open"
          >
            <CustomEditorItem
              position={index}
              session={session}
              openAccordionItem={setIndexToShow}
            />
          </AccordionItem>
        ))}
      </Accordion>
      <MDEditor
        preview="preview"
        className="flex-1"
        value={organizeTopicsIntoMd(sessions)}
        /* height={getElementHeightById("customEditorContainer")} */
        height={650}
      />
    </div>
  );
};

export default CustomEditor;

const organizeTopicsIntoMd = (topics: SessionReport[]) => {
  let text = "";
  topics.forEach((topic) => {
    const subject = `### ${topic.topic} \n`;
    const hashtags = `#### ${topic.hashtags.join(" ")} \n`;
    const description = `${topic.description} \n`;
    const lineBreak = `----------\n`;
    text += subject + hashtags + description + lineBreak;
  });
  return text;
};

const getElementHeightById = (elementId: string) => {
  const element = document.getElementById(elementId);
  const height = element?.clientHeight || 0;
  console.log("Height:", height);
  return height;
};
