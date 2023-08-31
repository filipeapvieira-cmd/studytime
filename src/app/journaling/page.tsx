import { FC } from "react";
import CustomEditor from "@/components/CustomEditor";
import Counter from "@/components/Control";
import ImageUpload from "@/components/ImageUpload";
interface JournalingPageProps {}

const JournalingPage: FC<JournalingPageProps> = ({}) => {
  return (
    <div className="container bg-secondary/90 rounded-lg shadow-lg">
      <Counter />
      <CustomEditor />
      <ImageUpload />
    </div>
  );
};

export default JournalingPage;
