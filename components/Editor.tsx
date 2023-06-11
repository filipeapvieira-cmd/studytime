"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState, useContext } from "react";
import { SessionTextContext } from "@/src/ctx/session-text-provider";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const Editor = ({}) => {
  const { sessionText, setSessionText } = useContext(SessionTextContext);
  return (
    <div>
      <MDEditor
        className="container"
        height={500}
        value={sessionText}
        onChange={(value) => {
          setSessionText(value || "");
        }}
      />
    </div>
  );
};

export default Editor;
