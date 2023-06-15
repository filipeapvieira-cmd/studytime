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
  return (
    <MDEditor
      className={`container p-0 ${className || ""}`}
      height={650}
      value={sessionText}
      onChange={(value) => {
        setSessionText(value || "");
      }}
    />
  );
};

export default Editor;
