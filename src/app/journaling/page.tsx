import { FC } from "react";
import CustomEditor from "@/components/CustomEditor";
import Counter from "@/components/Control";
import ImageUpload from "@/components/ImageUpload";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "✅ Journaling...",
};

function JournalingPage() {
  return (
    <div className="container bg-secondary/90 rounded-lg shadow-lg">
      <Counter />
      <CustomEditor />
      <ImageUpload />
    </div>
  );
}

export default JournalingPage;
