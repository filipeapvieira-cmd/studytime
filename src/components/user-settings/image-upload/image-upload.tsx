import { SetupInstructions } from "./instructions";
import CloudinaryConfigForm from "./form";

export const ImageUploadSettings = () => {
  return (
    <div className="flex-1 p-2 lg:p-4">
      <div className="mx-auto max-w-2xl space-y-4">
        <SetupInstructions />
        <CloudinaryConfigForm />
      </div>
    </div>
  );
};
