"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { FC, useState, useContext, useEffect } from "react";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import EditorSkeleton from "@/components/skeletons/EditorSkeleton";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

interface EditorProps extends React.HTMLProps<HTMLDivElement> {
  action?: "update";
  sessionData?: any;
}

const Editor: FC<EditorProps> = ({ className, action, sessionData }) => {
  /*
  const ctx = useContext(SessionTextContext);

   const { text, setText } =
    action && sessionData
      ? { text: ctx.sessionTextUpdate, setText: ctx.setSessionTextUpdate }
      : { text: ctx.sessionText, setText: ctx.setSessionText };

  useEffect(() => {
    if (action && sessionData) {
      const { content, feeling } = sessionData;
      let contentStr = "----------\n### **Content**\n";
      content.forEach(
        (element: { topic: string; subtopic: string; text: string }) => {
          contentStr += `#### @[${element.topic}${
            element.subtopic ? ` - ${element.subtopic}` : ""
          }]\n${element.text}\n`;
        }
      );

      let feelingsStr = "----------\n### **Feelings**\n";
      feelingsStr += `${feeling}`;

      setText?.(`${contentStr}${sessionData.feeling ? feelingsStr : ""}`);
    }
  }, []);

  return (
    <>
      <MDEditor
        className={`container p-0 ${className || ""}`}
        height={650}
        //value={sessionText}
        value={text}
        onChange={(value) => {
          //setSessionText(value || "");
          setText?.(value || "");
        }}
      />
    </>
  );
  */
  return <p>This component is deprecated</p>;
};

export default Editor;
