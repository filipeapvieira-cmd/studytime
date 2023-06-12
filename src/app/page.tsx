import Counter from "@/components/Control";
import Editor from "@/components/Editor";
import ImageUpload from "@/components/ImageUpload";
import ImageUploadItem from "@/components/ImageUploadItem";

export default function Home() {
  return (
    <div className="">
      <Counter />
      <Editor className="mt-5" />
      <ImageUpload />
    </div>
  );
}
