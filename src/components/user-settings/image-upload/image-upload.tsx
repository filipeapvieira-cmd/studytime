import CloudinaryConfigForm from "./form";
import { SetupInstructions } from "./instructions";

export const ImageUploadSettings = () => {
  return (
    <div className="space-y-4">
      <SetupInstructions />
      <CloudinaryConfigForm />
    </div>
  );
};
