import { ImageUploadSettings } from "@/src/components/user-settings/image-upload/image-upload";
import React from "react";

export default function SettingsPage() {
  return (
    <div className="px-4 flex-1 overflow-hidden max-w-6xl md:min-w-[1000px] w-4/5 mx-auto">
      <ImageUploadSettings />
    </div>
  );
}
