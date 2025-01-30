"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { StudySessionDto } from "@/src/types";
import ImageUpload from "@/src/components/ImageUpload";
import EditSessionControl from "./EditSessionControl";
import { Icons } from "@/src/components/icons";
import CustomEditor from "@/src/components/CustomEditor";

interface EditSessionProps {
  isModalOpen: boolean;
  handleModalClose: (isOpen: boolean) => void;
  selectedStudySession: StudySessionDto;
}

const EditSession = ({
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
              <EditSessionControl setIsModalOpen={handleModalClose} />
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
