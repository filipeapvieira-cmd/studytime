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
import { studySessionDto } from "@/types";
import Editor from "@/components/Editor";
import ImageUpload from "@/components/ImageUpload";
import EditSessionControl from "./EditSessionControl";
import { Icons } from "@/components/icons";
import CustomEditor from "@/components/CustomEditor";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import { TopicsContext } from "@/src/ctx/session-topics-provider";
import { createNewTopic } from "@/src/ctx/session-topics-provider";

import { convertListToTopic } from "@/lib/hooks/utils";

interface EditSessionProps {
  isModalOpen: boolean;
  handleModalClose: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStudySession: studySessionDto;
}

const EditSession: FC<EditSessionProps> = ({
  isModalOpen,
  handleModalClose,
  selectedStudySession,
}: EditSessionProps) => {
  const { setSessionFeelingsUpdate } = useContext(FeelingsContext);
  const { setSessionTopicsUpdate } = useContext(TopicsContext);

  // Add default data when modal closes
  useEffect(() => {
    return () => {
      setSessionTopicsUpdate([createNewTopic()]);
      setSessionFeelingsUpdate("");
    };
  }, [setSessionTopicsUpdate, setSessionFeelingsUpdate]);

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogContent className="max-w-6xl">
        <AlertDialogHeader>
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
