"use client";

import Counter from "@/components/Control";
import Editor from "@/components/Editor";
import ImageUpload from "@/components/ImageUpload";
import { useTheme } from "next-themes";

export default function Home() {
  const { setTheme } = useTheme();
  return (
    <div className="container bg-secondary/90 rounded-lg shadow-lg">
      <Counter />
      <Editor />
      <ImageUpload />
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
    </div>
  );
}
