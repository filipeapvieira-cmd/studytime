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
import CustomEditorFeelingsForm from "./CustomEditor-Feelings-Form";
import { SessionTextContext } from "@/src/ctx/session-text-provider";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

interface CustomEditorProps {}

const CustomEditor: FC<CustomEditorProps> = ({}) => {
  const { sessions: sessionTopics } = useContext(SaveSessionContext);
  const { sessionText: sessionFeelings } = useContext(SessionTextContext);
  const [indexToShow, setIndexToShow] = useState(sessionTopics.length - 1);

  useEffect(() => {
    setIndexToShow(sessionTopics.length - 1);
  }, [sessionTopics.length]);

  console.log(sessionTopics);
  //console.log(getElementHeightById("customEditorContainer"));
  return (
    <div className="flex">
      <div className="flex-1 self-start">
        <Accordion
          type="multiple"
          value={[String(indexToShow)]}
          //id="customEditorContainer"
        >
          {sessionTopics.map((session, index) => (
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
        <CustomEditorFeelingsForm />
      </div>
      <MDEditor
        preview="preview"
        className="flex-1"
        value={organizeContent(
          organizeTopics(sessionTopics),
          organizeFeelings(sessionFeelings)
        )}
        /* height={getElementHeightById("customEditorContainer")} */
        height={650}
      />
    </div>
  );
};

export default CustomEditor;

const organizeTopics = (topics: SessionReport[]) => {
  let text = "";
  text += `# Description \n`;
  topics.forEach((topic) => {
    const subject = `### ${topic.topic} \n`;
    const hashtags = `#### ${topic.hashtags} \n`;
    const description = `${topic.description} \n`;
    const lineBreak = `----------\n`;
    text += subject + hashtags + description;
  });
  return text;
};

const organizeFeelings = (sessionFeelings: string) => {
  let text = "";
  const title = `# Feelings \n`;
  const feelings = `${sessionFeelings}`;

  text += feelings !== "" ? title + feelings : "";

  return text;
};

const organizeContent = (topics: string, feelings: string) => {
  return topics + feelings;
};

const getElementHeightById = (elementId: string) => {
  const element = document.getElementById(elementId);
  const height = element?.clientHeight || 0;
  console.log("Height:", height);
  return height;
};
