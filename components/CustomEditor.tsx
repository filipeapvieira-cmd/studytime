"use client";
import { FC, useContext, useEffect, useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CustomEditorItem from "./CustomEditor-Item";
import { TopicsContext } from "@/src/ctx/session-topics-provider";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import EditorSkeleton from "@/components/skeletons/EditorSkeleton";
import { studySessionDto, Topic } from "@/types";
import CustomEditorFeelingsForm from "./custom-editor-feelings-form";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import { Button } from "./ui/button";
import { marked } from "marked";
import { Icons } from "@/components/icons";
import CustomEditorMarkdownPreview from "./CustomEditor-Markdown-Preview";
import BtnOpenMkdownPrev from "./ui/BtnOpenMkdownPrev";
import useFeelingsAndTopics from "@/src/hooks/useFeelingsAndTopics";
import convertListToTopic from "@/hooks/useFeelingsAndTopics";
import Title from "./custom-editor/title";
import EditorContainer from "./custom-editor/container";
interface CustomEditorProps {
  action?: "update";
  studySessionToUpdate?: studySessionDto;
}

const CustomEditor: FC<CustomEditorProps> = ({
  action,
  studySessionToUpdate,
}) => {
  const {
    sessionFeelings,
    setSessionFeelings,
    sessionTopics,
    setSessionTopics,
  } = useFeelingsAndTopics({
    action,
    studySessionToUpdate,
  });

  const lastTopic = sessionTopics.length - 1;
  const [topicToShow, setTopicToShow] = useState(lastTopic);
  const [isMarkdownPreviewerVisible, setIsMarkdownPreviewerVisible] =
    useState(true);

  useEffect(() => {
    setTopicToShow(lastTopic);
  }, [sessionTopics.length, lastTopic]);

  //console.log(sessionTopics);

  const handleOpenPreviewer = () => {
    setIsMarkdownPreviewerVisible((prevValue) => !prevValue);
  };

  const handleCreateMarkup = useMemo(() => {
    return organizeContent(
      organizeTopics(sessionTopics),
      organizeFeelings(sessionFeelings)
    );
  }, [sessionTopics, sessionFeelings]);

  return (
    <div className="flex w-full overflow-auto max-h-[745px]">
      <div className="flex-1 self-start">
        <EditorContainer className="flex flex-col space-y-2">
          <Title title="Description" />
          <Accordion type="multiple" value={[String(topicToShow)]}>
            {sessionTopics.map((topic, index) => (
              <AccordionItem
                value={String(index)}
                key={topic.id}
                data-state="open"
              >
                <CustomEditorItem
                  position={index}
                  topic={topic}
                  openAccordionItem={setTopicToShow}
                  setSessionTopics={setSessionTopics}
                  isUpdate={!!(action && studySessionToUpdate)}
                  isMarkdownPreviewerVisible={isMarkdownPreviewerVisible}
                />
              </AccordionItem>
            ))}
          </Accordion>
        </EditorContainer>
        <CustomEditorFeelingsForm
          sessionFeelings={sessionFeelings}
          setSessionFeelings={setSessionFeelings}
        />
      </div>
      <BtnOpenMkdownPrev
        handleOpenPreviewer={handleOpenPreviewer}
        isMarkdownPreviewerVisible={isMarkdownPreviewerVisible}
      />
      {isMarkdownPreviewerVisible && (
        <CustomEditorMarkdownPreview handleCreateMarkup={handleCreateMarkup} />
      )}
    </div>
  );
};

export default CustomEditor;

const organizeTopics = (topics: Topic[]) => {
  let text = "";
  text += hasDescription(topics) ? `# Description \n\n----------\n\n` : ``;
  topics.forEach((topic) => {
    const subject = `### ${topic.title} \n`;
    const hashtags = `#### ${topic.hashtags} \n`;
    const description = `${topic.description} \n`;
    const lineBreak = `----------\n`;

    text += subject + hashtags + description;
  });

  return text;
};

const organizeFeelings = (sessionFeelings: string) => {
  let text = "";
  // In markdown, you often need two newlines to create a distinct separation between blocks
  const title = `# Feelings \n\n----------\n\n`;
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

const hasDescription = (topics: Topic[]) => {
  return topics.some((topic) => topic.description !== "");
};
