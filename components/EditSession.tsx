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
import { TopicDto } from "@/types";
import Editor from "@/components/Editor";
import ImageUpload from "@/components/ImageUpload";
import EditSessionControl from "./EditSessionControl";
import { Icons } from "@/components/icons";
import CustomEditor from "@/components/CustomEditor";

interface EditSessionProps {
  open: boolean;
  close: React.Dispatch<React.SetStateAction<boolean>>;
  data: TopicDto[];
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
                  {/* TODO: data[0].date -> 
                  take the date of the first index because they should all share the same date. this needs to be refactored and verified */}
                  <p className="text-lg font-bold">{data[0].date}</p>
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
              {/* <CustomEditor action="update" sessionData={data} /> */}
              <ImageUpload />
            </>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSession;
