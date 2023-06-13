import Counter from "@/components/Control";
import Editor from "@/components/Editor";
import ImageUpload from "@/components/ImageUpload";
import ImageUploadItem from "@/components/ImageUploadItem";

export default function Home() {
  return (
    <div className="container bg-secondary rounded-lg shadow-lg">
      <Counter />
      <Editor />
      <ImageUpload />
    </div>
  );
}
