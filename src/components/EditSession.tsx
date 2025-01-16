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
} from "@/src/components/ui/alert-dialog";
import { studySessionDto } from "@/src/types";
import ImageUpload from "@/src/components/ImageUpload";
import EditSessionControl from "./EditSessionControl";
import { Icons } from "@/src/components/icons";
import CustomEditor from "@/src/components/CustomEditor";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import { TopicsContext } from "@/src/ctx/session-topics-provider";
import { createNewTopic } from "@/src/ctx/session-topics-provider";

import { convertListToTopic } from "@/src/lib/hooks/utils";

interface EditSessionProps {
  isModalOpen: boolean;
  handleModalClose: (isOpen: boolean) => void;
  selectedStudySession: studySessionDto;
}

const EditSession: FC<EditSessionProps> = ({
  isModalOpen,
  handleModalClose,
  selectedStudySession,
}: EditSessionProps) => {
  
  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogContent className="max-w-6xl">
        <AlertDialogHeader className="max-h-[90vh]">
          <AlertDialogTitle asChild>
            <>
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Icons.calendar />
                  <p className="text-lg font-bold">
                    {selectedStudySession.date}
                  </p>
                </div>
                <Icons.closeCross
                  onClick={() => handleModalClose(false)}
                  className="hover:cursor-pointer hover:bg-border/50"
                />
              </div>
              <EditSessionControl
                setIsModalOpen={handleModalClose}
                studySessionToEdit={selectedStudySession}
              />
            </>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <>
              <CustomEditor
                action="update"
                studySessionToUpdate={selectedStudySession}
              />
              <ImageUpload />
            </>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSession;
