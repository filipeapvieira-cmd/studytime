"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { FC, useState, useContext } from "react";
import { SessionTextContext } from "@/src/ctx/session-text-provider";
import EditorSkeleton from "@/components/skeletons/EditorSkeleton";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

interface EditorProps extends React.HTMLProps<HTMLDivElement> {}

const Editor: FC<EditorProps> = ({ className }) => {
  const { sessionText, setSessionText } = useContext(SessionTextContext);

/*   const fecthSession = async () => {
    const sessionNumber = 7;
    const response = await fetch(`api/session/get/${sessionNumber}`);
    const data = await response.json();
    console.log(data);

    const { content, feelings } = data;

    let contentStr = "----------\n### **Content**\n";
    content.forEach((element: any) => {
      contentStr += `#### @[${element.topic}${
        element.subtopic ? ` - ${element.subtopic}` : ""
      }]\n${element.contentDescription}\n`;
    });

    let feelingsStr = "----------\n### **Feelings**\n";
    feelingsStr += `${feelings.feelingDescription}`;

    setSessionText(`${contentStr}${feelingsStr}`);
  } */

  return (
    <>
    <MDEditor
      className={`container p-0 ${className || ""}`}
      height={650}
      value={sessionText}
      onChange={(value) => {
        setSessionText(value || "");
      }}
    />
    {/* <button onClick={fecthSession}>Fetch Session</button> */}
    </>
  );
  
};

export default Editor;
