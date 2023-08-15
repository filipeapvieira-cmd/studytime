import Counter from "@/components/Control";
import Editor from "@/components/Editor";
import ImageUpload from "@/components/ImageUpload";
import { createDummyData } from "@/docs/dummy-data";
import CustomEditor from "@/components/CustomEditor";

export default async function Home() {
  //migrateSessionData();
  //createDummyData();
  return (
    <div className="container bg-secondary/90 rounded-lg shadow-lg">
      <Counter />
      {/* <Editor /> */}
      <CustomEditor />
      <ImageUpload />
    </div>
  );
}
