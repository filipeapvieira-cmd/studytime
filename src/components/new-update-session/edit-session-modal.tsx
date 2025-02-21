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
import { Icons } from "@/src/components/icons";
import { TopicSidebar } from "../new-journaling/topic-sidebar";
import EditSessionToolbar from "../EditSessionControl";

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
      <AlertDialogContent className="max-w-6xl ">
        <AlertDialogHeader className="h-[90vh]">
          <AlertDialogTitle asChild>
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <Icons.Calendar />
                <p className="text-lg font-bold">{selectedStudySession.date}</p>
              </div>
              <Icons.CloseCross
                onClick={() => handleModalClose(false)}
                className="hover:cursor-pointer hover:bg-border/50"
              />
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="pt-4">
              <EditSessionToolbar setIsModalOpen={handleModalClose} />
              <TopicSidebar className="max-h-[80%] min-h-[80%] rounded-t-none" />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSession;
