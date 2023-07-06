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
    date: data.date,
  });

  useEffect(() => {
    setSessionTiming({
      id: data.id,
      startTime: data.startTime,
      pauseDuration: data.pauseDuration,
      endTime: data.endTime,
      effectiveTime: data.effectiveTime,
      date: data.date,
    });
  }, [data]);

  const timeStringToDate = (
    sessionTime: string,
    sessionDate: string
  ): number => {
    const [year, month, day] = sessionDate.split("-").map(Number);
    const [hours, minutes, seconds] = sessionTime.split(":").map(Number);
    // Months in JavaScript are zero-based (0 - 11), so subtract 1 from the month value
    const date = new Date(year, month - 1, day, hours, minutes, seconds);

    return date.getTime();
  };

  const timeStringToMillis = (pauseDuration: string): any => {
    const [hours, minutes, seconds] = pauseDuration.split(":").map(Number);
    const totalMilliseconds =
      hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
    return totalMilliseconds;
  };

  const { startTime, pauseDuration, endTime, effectiveTime, id, date } =
    sessionTiming;
  const { sessionTextUpdate } = useContext(SessionTextContext);

  const sessionLog: SessionLogUpdate = {
    ...getSessionLog(
      sessionTextUpdate,
      timeStringToDate(startTime, date),
      timeStringToDate(endTime, date),
      timeStringToMillis(pauseDuration)
    ),
    id,
  };

  const handleSave = async () => {
    await persistSession(
      sessionLog,
      `${UPDATE_SESSION_ENDPOINT}${id}`,
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
