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
import { SessionTextContext } from "@/src/ctx/session-text-provider";
import { getSessionLog, persistSession } from "@/lib/session-log/utils";
import { SessionLog, SessionLogUpdate } from "@/types";
import { UPDATE_SESSION_ENDPOINT, HTTP_METHOD } from "@/constants/config";

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
  const [sessionTiming, setSessionTiming] = useState({
    id: data.id,
    startTime: data.startTime,
    pauseDuration: data.pauseDuration,
    endTime: data.endTime,
    effectiveTime: data.effectiveTime,
  });

  useEffect(() => {
    setSessionTiming({
      id: data.id,
      startTime: data.startTime,
      pauseDuration: data.pauseDuration,
      endTime: data.endTime,
      effectiveTime: data.effectiveTime,
    });
  }, [data]);

  function timeStringToMillis(timeString: string | undefined): number {
    if (!timeString) return 0;

    // Use today's date
    const date = new Date();

    // Extract hours, minutes, and seconds from the string
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    // Set the time on the date
    date.setHours(hours, minutes, seconds);

    // Return the date as milliseconds since Jan 1, 1970
    return date.getTime();
  }

  const { startTime, pauseDuration, endTime, effectiveTime, id } =
    sessionTiming;
  const { sessionTextUpdate } = useContext(SessionTextContext);

  const sessionLog: SessionLogUpdate = {
    ...getSessionLog(
      sessionTextUpdate,
      timeStringToMillis(startTime),
      timeStringToMillis(pauseDuration),
      timeStringToMillis(endTime)
    ),
    id,
  };

  const handleSave = async () => {
    await persistSession(
      sessionLog,
      `${UPDATE_SESSION_ENDPOINT}id`,
      HTTP_METHOD.PUT
    );
  };

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
                startTime={startTime || ""}
                pauseDuration={pauseDuration || ""}
                endTime={endTime || ""}
                effectiveTime={effectiveTime}
                setIsModalOpen={close}
                setSessionTiming={setSessionTiming}
              />
            </>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <>
              <Editor action="update" sessionData={data} />
              <ImageUpload />
            </>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => close(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleSave}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditSession;
