"use client";
import { FC, useContext, useEffect, useState, useMemo } from "react";
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
import { Button } from "./ui/button";
import { marked } from "marked";

interface CustomEditorProps {}

const CustomEditor: FC<CustomEditorProps> = ({}) => {
  const { sessions: sessionTopics } = useContext(SaveSessionContext);
  const { sessionText: sessionFeelings } = useContext(SessionTextContext);
  const [indexToShow, setIndexToShow] = useState(sessionTopics.length - 1);
  const [isMarkdownPreviewerVisible, setIsMarkdownPreviewerVisible] =
    useState(true);

  useEffect(() => {
    setIndexToShow(sessionTopics.length - 1);
  }, [sessionTopics.length]);

  console.log(sessionTopics);

  const handleOpenPreviewer = () => {
    setIsMarkdownPreviewerVisible((prevValue) => !prevValue);
  };

  const handleCreateMarkup = useMemo(() => {
    const result = marked.parse(
      organizeContent(
        organizeTopics(sessionTopics),
        organizeFeelings(sessionFeelings)
      )
    );
    return {
      __html: result,
    };
  }, [sessionTopics, sessionFeelings]);

  return (
    <div className="flex">
      <div className="flex-1 self-start">
        <h1 className="text-foreground bg-background text-3xl text-center rounded-md p-2">
          Description
        </h1>
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
      <Button onClick={handleOpenPreviewer} className="h-full self-center">
        {/* Add your arrow image or icon here */}
        {isMarkdownPreviewerVisible ? "Close" : "Open"}
      </Button>
      {isMarkdownPreviewerVisible && (
        <div
          className="flex-1"
          id="preview"
          dangerouslySetInnerHTML={handleCreateMarkup}
        />
      )}
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
