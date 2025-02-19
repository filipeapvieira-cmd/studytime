"use client";

import React, { useRef, useEffect, useState } from "react";
import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import { BlockToolConstructable } from "@editorjs/editorjs";
import { JSONValue } from "@/src/types";
import { prepareContent } from "@/src/lib/utils";
import { useCustomToast } from "@/src/hooks/useCustomToast";

type CustomEditorProps = {
  value: string | JSONValue;
  onSave: (contentJson: JSONValue) => void;
};

export const CustomEditor = ({ value, onSave }: CustomEditorProps) => {
  const { showToast } = useCustomToast();
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
            setEditorReady(true);
            const content = prepareContent(value);

            editorRef.current
              .render(content)
              .then(() => {
                // Focus the editor to have the blinking cursor
                if (typeof editorRef.current.focus === "function") {
                  editorRef.current.focus();
                } else {
                  // Fallback: Focus the editor container (if focus() isn't available)
                  const holder = document.getElementById("editorjs");
                  holder?.focus();
                }
              })
              .catch((error: any) =>
                console.error("Error rendering content:", error)
              );
          },
          onChange: async () => {
            await handleSave();
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
                uploader: {
                  async uploadByFile(file: File) {
                    try {
                      return await customUpload(file);
                    } catch (error) {
                      console.error("Error uploading image:", error);
                      showToast({
                        status: "error",
                        message:
                          (error as any)?.message ?? "Failed to upload image",
                      });
                      return {
                        success: 0,
                        message: "Failed to upload image",
                      };
                    }
                  },
                },
                /*           endpoints: {
                  byFile: "/api/editor/uploadImage",
                }, */
              },
            },
          },
        });
      }
    }

    initializeEditor();

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
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
        onSave(savedData);
      } catch (error) {
        console.error("Error saving editor content:", error);
      }
    }
  };

  return (
    <div className="flex flex-1">
      <div
        id="editorjs"
        className="w-full flex-1 overflow-y-auto px-14 py-4 rounded-xl border border-zinc-800/50 
                  bg-zinc-900/50 text-white placeholder-zinc-500
                  resize-none focus:outline-none focus:ring-2 focus:ring-zinc-700
                  shadow-[0_0_15px_rgba(0,0,0,0.1)] selection:bg-lime-400 selection:text-black"
        onBlur={handleSave}
      />
    </div>
  );
};

async function customUpload(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("/api/editor/uploadImage", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Have you configured the Image Upload settings in your profile?`
    );
  }

  const result = await response.json();

  const imgUrl = result.file.url;

  if (!imgUrl) {
    throw new Error("Image URL missing from response");
  }

  return {
    success: 1,
    file: {
      url: imgUrl,
    },
  };
}
