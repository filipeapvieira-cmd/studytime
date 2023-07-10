"use client";

import { FC, useState } from "react";
import FormField from "@/components/FormField";
import BtnClose from "./ui/BtnClose";
import { Button } from "./ui/button";
import { Icons } from "@/components/icons";
import UserActionConfirmation from "./UserActionConfirmation";
import { retrieveTextFromJson } from "@/lib/utils";

interface EditSessionControlProps {
  startTime: string;
  pauseDuration: string;
  endTime: string;
  effectiveTime: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSessionTiming: React.Dispatch<
    React.SetStateAction<{
      id: number;
      startTime: string;
      pauseDuration: string;
      endTime: string;
      effectiveTime: string;
      date: string;
    }>
  >;
  saveSession: () => Promise<void>;
  isLoading: boolean;
}

const EditSessionControl: FC<EditSessionControlProps> = ({
  startTime,
  pauseDuration,
  endTime,
  effectiveTime,
  setSessionTiming,
  saveSession,
  isLoading,
}: EditSessionControlProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSessionTiming((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };

  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex space-x-2">
        <FormField
          name="startTime"
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => handleOnChange(e)}
        />
        <FormField
          className="max-w-[148px]"
          name="pauseDuration"
          label="Pause Time"
          type="text"
          value={pauseDuration}
          onChange={(e) => handleOnChange(e)}
        />
        <FormField
          name="endTime"
          label="End Time"
          type="time"
          value={endTime}
          onChange={(e) => handleOnChange(e)}
        />
        <FormField
          className="max-w-[148px]"
          name="effectiveTime"
          label="Effective Time"
          type="text"
          value={effectiveTime}
          onChange={(e) => handleOnChange(e)}
        />
      </div>
      <div className="flex space-x-2">
        <UserActionConfirmation type="updateSession" onConfirm={saveSession}>
          <Button disabled={isLoading}>
            {isLoading && <Icons.loading className="h-6 w-6 animate-spin" />}
            {!isLoading && <Icons.save />}
          </Button>
        </UserActionConfirmation>

        <UserActionConfirmation type="deleteSession" onConfirm={saveSession}>
          <Button variant="destructive">
            <Icons.close />
          </Button>
        </UserActionConfirmation>
      </div>
    </div>
  );
};

export default EditSessionControl;
