"use client";

import { FC, useContext, useState, useEffect } from "react";
import FormField from "@/components/FormField";
import BtnClose from "./ui/BtnClose";
import { Button } from "./ui/button";
import { Icons } from "@/components/icons";
import UserActionConfirmation from "./UserActionConfirmation";
import { retrieveTextFromJson } from "@/lib/utils";
import { SessionTextContext } from "@/src/ctx/session-text-provider";
import { getSessionLog, persistSession } from "@/lib/session-log/utils";
import { SessionLog, SessionLogUpdate } from "@/types";
import { UPDATE_SESSION_ENDPOINT, HTTP_METHOD } from "@/constants/config";
import { usePersistSession } from "@/src/hooks/usePersistSession";
import { StudySession } from "@/types/tanstack-table";
import {
  timeStringToDate,
  timeStringToMillis,
} from "@/lib/session-log/update-utils";

interface EditSessionControlProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  data: StudySession;
}

const EditSessionControl: FC<EditSessionControlProps> = ({
  data,
}: EditSessionControlProps) => {
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

  const { sessionTextUpdate } = useContext(SessionTextContext);
  const { startTime, pauseDuration, endTime, effectiveTime, id, date } =
    sessionTiming;

  const sessionLog: SessionLogUpdate = {
    ...getSessionLog(
      sessionTextUpdate,
      timeStringToDate(startTime, date),
      timeStringToDate(endTime, date),
      timeStringToMillis(pauseDuration)
    ),
    id,
  };

  const { isLoading, saveSessionHandler } = usePersistSession({
    sessionLog,
    url: `${UPDATE_SESSION_ENDPOINT}${id}`,
    method: HTTP_METHOD.PUT,
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSessionTiming((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };

  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex space-x-2">
        <FormField
          name="startTime"
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => handleOnChange(e)}
        />
        <FormField
          className="max-w-[148px]"
          name="pauseDuration"
          label="Pause Time"
          type="text"
          value={pauseDuration}
          onChange={(e) => handleOnChange(e)}
        />
        <FormField
          name="endTime"
          label="End Time"
          type="time"
          value={endTime}
          onChange={(e) => handleOnChange(e)}
        />
        <FormField
          className="max-w-[148px]"
          name="effectiveTime"
          label="Effective Time"
          type="text"
          value={effectiveTime}
          onChange={(e) => handleOnChange(e)}
        />
      </div>
      <div className="flex space-x-2">
        <UserActionConfirmation
          type="updateSession"
          onConfirm={saveSessionHandler}
        >
          <Button disabled={isLoading}>
            {isLoading && <Icons.loading className="h-6 w-6 animate-spin" />}
            {!isLoading && <Icons.save />}
          </Button>
        </UserActionConfirmation>

        <UserActionConfirmation type="deleteSession" onConfirm={() => {}}>
          <Button variant="destructive">
            <Icons.close />
          </Button>
        </UserActionConfirmation>
      </div>
    </div>
  );
};

export default EditSessionControl;
