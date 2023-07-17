import Counter from "@/components/Control";
import Editor from "@/components/Editor";
import ImageUpload from "@/components/ImageUpload";
import { migrateSessionData } from "@/docs/migrate-data";

export default async function Home() {
  //migrateSessionData();
  return (
    <div className="container bg-secondary/90 rounded-lg shadow-lg">
      <Counter />
      <Editor />
      <ImageUpload />
    </div>
  );
}
