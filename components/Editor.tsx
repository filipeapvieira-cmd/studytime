"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";

interface EditorProps {}

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

const Editor: FC<EditorProps> = ({}) => {
  const [value, setValue] = useState<string>("**Hello world!!!**");
  return (
    <div>
      <MDEditor
        className="container"
        value={value}
        onChange={(value) => {
          setValue(value || "");
        }}
      />
    </div>
  );
};

export default Editor;
