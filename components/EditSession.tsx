"use client";

import React, { FC, useState, useContext, useEffect } from "react";
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
  data: StudySession;
}

const EditSession: FC<EditSessionProps> = ({
  open,
  close,
  data,
}: EditSessionProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-6xl">
        <AlertDialogHeader>
          <AlertDialogTitle asChild>
            <>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Icons.calendar />
                  <p className="text-lg font-bold">{data?.date}</p>
                </div>
                <Icons.closeCross
                  onClick={() => close(false)}
                  className="hover:cursor-pointer hover:bg-border/50"
                />
              </div>
              <EditSessionControl setIsModalOpen={close} data={data} />
            </>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <>
              <Editor action="update" sessionData={data} />
              <ImageUpload />
            </>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSession;
