import { SetupInstructions } from "./instructions";
import CloudinaryConfigForm from "./form";

export const ImageUploadSettings = () => {
  return (
    <div className="space-y-4">
      <SetupInstructions />
      <CloudinaryConfigForm />
    </div>
  );
};
