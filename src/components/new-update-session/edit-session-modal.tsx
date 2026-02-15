"use client";

import React from "react";
import { Icons } from "@/src/components/icons";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import type { StudySessionDto } from "@/src/types";
import EditSessionToolbar from "../EditSessionControl";
import { TopicSidebar } from "../new-journaling/topic-sidebar";

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
              <TopicSidebar
                className="max-h-[80%] min-h-[80%] rounded-t-none"
                noPortal={true}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSession;
