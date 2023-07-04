"use client";

import React, { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StudySession } from "@/types/tanstack-table";
import Editor from "@/components/Editor";
import ImageUpload from "@/components/ImageUpload";
import EditSessionControl from "./EditSessionControl";
import { Icons } from "@/components/icons";

interface EditSessionProps {
  open: boolean;
  close: React.Dispatch<React.SetStateAction<boolean>>;
  data: StudySession | undefined;
}

const EditSession: FC<EditSessionProps> = ({
  open,
  close,
  data,
}: EditSessionProps) => {
  return (
    <AlertDialog open={open}>
      {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
      <AlertDialogContent className="max-w-6xl">
        <AlertDialogHeader>
          <AlertDialogTitle asChild>
            <>
              <div className="flex space-x-2">
                <Icons.calendar />
                <p className="text-lg font-bold">{data?.date}</p>
              </div>
              <EditSessionControl
                startTime={data?.startTime}
                pauseDuration={data?.pauseDuration}
                endTime={data?.endTime}
                effectiveTime={data?.effectiveTime}
                sessionName={data?.sessionName}
                sessionDescription={data?.sessionDescription}
                setIsModalOpen={close}
              />
            </>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <>
              <Editor />
              <ImageUpload />
            </>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => close(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSession;
