import { FC } from "react";
import FormField from "@/components/FormField";
import BtnClose from "./ui/BtnClose";

interface EditSessionControlProps {
  startTime: string;
  pauseDuration: string;
  endTime: string;
  effectiveTime: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditSessionControl: FC<EditSessionControlProps> = ({
  startTime,
  pauseDuration,
  endTime,
  effectiveTime,
  setIsModalOpen,
}: EditSessionControlProps) => {
  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex space-x-2">
        <FormField
          name="startTime"
          label="Start Time"
          type="time"
          value={startTime}
        />
        <FormField
          className="max-w-[148px]"
          name="pauseDuration"
          label="Pause Time"
          type="text"
          value={pauseDuration}
        />
        <FormField
          name="endTime"
          label="End Time"
          type="time"
          value={endTime}
        />
        <FormField
          className="max-w-[148px]"
          name="effectiveTime"
          label="Effective Time"
          type="text"
          value={effectiveTime}
        />
      </div>
      <div>
        <BtnClose visible={true} onClick={() => setIsModalOpen(false)} />
      </div>
    </div>
  );
};

export default EditSessionControl;
