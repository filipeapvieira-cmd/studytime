"use client";

import Counter from "@/components/Control";
import Editor from "@/components/Editor";
import ImageUpload from "@/components/ImageUpload";

export default function Home() {
  return (
    <div className="container bg-secondary/90 rounded-lg shadow-lg">
      <Counter />
      <Editor />
      <ImageUpload />
    </div>
  );
}
