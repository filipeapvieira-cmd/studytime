"use client";

import React, { useRef, useEffect, useState } from "react";
import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import { BlockToolConstructable } from "@editorjs/editorjs";

// Remove direct ImageTool import
export const CustomEditor: React.FC = () => {
  const editorRef = useRef<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [loadContent, setLoadContent] = useState<string>("");

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
                  byFile: "/api/uploadImage", // Add your image upload endpoint
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
      }
    };
  }, [isMounted]);

  const handleLoad = async () => {
    if (editorRef.current) {
      try {
        // Parse the JSON from the textarea.
        const parsedData = JSON.parse(loadContent);
        await editorRef.current.render(parsedData);
      } catch (error) {
        console.error("Error loading editor content:", error);
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  const handleSave = async () => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save();
        console.log("Saved Data:", savedData);
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
      />
      {/*    /*       <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSave} style={{ marginRight: "1rem" }}>
          Save
        </button>
        <span>Check the console for the saved JSON.</span>
      </div>
      <div style={{ marginTop: "1rem" }}>
        <textarea
          placeholder="Paste your Editor.js JSON here..."
          value={loadContent}
          onChange={(e) => setLoadContent(e.target.value)}
          style={{ width: "100%", height: "150px", marginBottom: "0.5rem" }}
        />
        <button onClick={handleLoad}>Load Content</button>
      </div> */}
    </div>
  );
};
