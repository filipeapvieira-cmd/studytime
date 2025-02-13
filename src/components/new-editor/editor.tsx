"use client";

import React, { useRef, useEffect, useState } from "react";
import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import { BlockToolConstructable } from "@editorjs/editorjs";
import { JSONValue } from "@/src/types";
import { prepareContent } from "@/src/lib/utils";

type CustomEditorProps = {
  value: string | JSONValue;
  onBlur: (contentJson: JSONValue) => void;
};

export const CustomEditor = ({ value, onBlur }: CustomEditorProps) => {
  const editorRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  // Ensures we're in a client-only environment
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    async function initializeEditor() {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const ImageTool = (await import("@editorjs/image")).default;

      if (!editorRef.current) {
        editorRef.current = new EditorJS({
          holder: "editorjs",
          onReady: () => {
            console.log("Editor.js is ready");
            setEditorReady(true);
            // Render initial content once editor is ready
            const content = prepareContent(value);
            editorRef.current
              .render(content)
              .catch((error: any) =>
                console.error("Error rendering content:", error)
              );
          },
          tools: {
            header: {
              class: Header as unknown as BlockToolConstructable,
              config: {
                placeholder: "Enter a header",
                levels: [2, 3, 4],
                defaultLevel: 3,
              },
            },
            list: {
              class: EditorjsList as unknown as BlockToolConstructable,
              inlineToolbar: true,
              config: {
                defaultStyle: "unordered",
              },
            },
            image: {
              class: ImageTool,
              config: {
                endpoints: {
                  byFile: "/api/editor/uploadImage",
                },
              },
            },
          },
        });
      }
    }

    initializeEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isMounted]);

  if (!isMounted) {
    return null;
  }

  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save();
        onBlur(savedData);
      } catch (error) {
        console.error("Error saving editor content:", error);
      }
    }
  };

  return (
    <div className="flex flex-1">
      <div
        id="editorjs"
        className="w-full !flex-1 px-14 py-4 rounded-xl border border-zinc-800/50 
                  bg-zinc-900/50 text-white placeholder-zinc-500
                  resize-none focus:outline-none focus:ring-2 focus:ring-zinc-700
                  shadow-[0_0_15px_rgba(0,0,0,0.1)] selection:bg-lime-400 selection:text-black"
        onBlur={handleSave}
      />
    </div>
  );
};
