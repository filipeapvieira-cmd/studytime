import { FC } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface CustomEditorFormProps {}

const CustomEditorForm: FC<CustomEditorFormProps> = ({}) => {
  return (
    <>
      <form>
        <div className="flex">
          <Input placeholder="Subject" />
          <Input placeholder="Hashtags" />
        </div>
        <textarea rows={10} className="w-full" />
      </form>
      <Button>New Topic</Button>
      <Button>Delete</Button>
    </>
  );
};

export default CustomEditorForm;
