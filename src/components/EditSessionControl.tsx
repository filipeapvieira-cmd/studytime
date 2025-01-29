"use client";

import { FC, useContext, useState, useEffect, useRef } from "react";
import FormField from "@/src/components/FormField";
import { Button } from "./ui/button";
import ReactInputMask from "react-input-mask";
import UserActionConfirmation from "./UserActionConfirmation";
import { FeelingsContext } from "@/src/ctx/session-feelings-provider";
import { FullSessionLogUpdate, StudySessionDto } from "@/src/types";
import {
  UPDATE_SESSION_ENDPOINT,
  HTTP_METHOD,
  DELETE_SESSION_ENDPOINT,
  GET_ALL_SESSIONS_ENDPOINT,
} from "@/src/constants/config";
import { usePersistSession } from "@/src/hooks/usePersistSession";
import {
  getSaveBtnIcon,
  getDeleteBtnIcon,
  convertTimeStringToDate,
  convertTimeStringToMilliseconds,
} from "@/src/lib/session-log/update-utils";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { getFullSessionLog } from "@/src/lib/session-log/utils";
import { TopicsContext } from "@/src/ctx/session-topics-provider";
import { Label } from "./ui/label";

interface EditSessionControlProps {
  setIsModalOpen: (isOpen: boolean) => void;
  studySessionToEdit: StudySessionDto;
}

const EditSessionControl: FC<EditSessionControlProps> = ({
  studySessionToEdit,
  setIsModalOpen,
}: EditSessionControlProps) => {
  const { sessionFeelingsUpdate: sessionFeelings } =
    useContext(FeelingsContext);
  const { sessionTopicsUpdate: sessionTopics } = useContext(TopicsContext);

  const [sessionTiming, setSessionTiming] = useState({
    id: studySessionToEdit.id,
    startTime: studySessionToEdit.startTime,
    pauseDuration: studySessionToEdit.pauseDuration,
    endTime: studySessionToEdit.endTime,
    effectiveTime: studySessionToEdit.effectiveTime,
    date: studySessionToEdit.date,
  });

  const { startTime, pauseDuration, endTime, effectiveTime, id, date } =
    sessionTiming;

  const sessionTime = {
    startTime: convertTimeStringToDate(startTime, date),
    endTime: convertTimeStringToDate(endTime, date),
    totalPauseTime: convertTimeStringToMilliseconds(pauseDuration),
  };

  useEffect(() => {
    setSessionTiming({
      id: studySessionToEdit.id,
      startTime: studySessionToEdit.startTime,
      pauseDuration: studySessionToEdit.pauseDuration,
      endTime: studySessionToEdit.endTime,
      effectiveTime: studySessionToEdit.effectiveTime,
      date: studySessionToEdit.date,
    });
  }, [studySessionToEdit]);

  const actionType = useRef("");

  const sessionLog: FullSessionLogUpdate = {
    ...getFullSessionLog({
      sessionFeelings,
      sessionTopics,
      sessionTime,
    }),
    id: studySessionToEdit.id,
  };

  const onSuccess = () => {
    setIsModalOpen(false);
    mutate(GET_ALL_SESSIONS_ENDPOINT);
  };

  const { isLoading, httpRequestHandler } = usePersistSession();

  const handleControl = (action: "update" | "delete") => {
    actionType.current = "";
    const updateParameters = {
      body: sessionLog,
      url: `${UPDATE_SESSION_ENDPOINT}${id}`,
      method: HTTP_METHOD.PUT,
      onSuccess,
    };
    const deleteParameters = {
      url: `${DELETE_SESSION_ENDPOINT}${id}`,
      method: HTTP_METHOD.DELETE,
      onSuccess,
    };

    if (action === "update") {
      actionType.current = "update";
      httpRequestHandler(updateParameters);
    } else {
      actionType.current = "delete";
      httpRequestHandler(deleteParameters);
    }
  };

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
        <div>
          <Label htmlFor={pauseDuration}>Pause Time</Label>
          <ReactInputMask
            name="pauseDuration"
            value={pauseDuration}
            mask="99:99:99"
            placeholder="HH:MM:SS"
            alwaysShowMask
            onChange={(e) => handleOnChange(e)}
            defaultValue="00:00:00"
            className="max-w-[148px] flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
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
          disabled
        />
      </div>
      <div className="flex space-x-2">
        <UserActionConfirmation
          type="updateSession"
          onConfirm={() => handleControl("update")}
        >
          <Button disabled={isLoading}>
            {getSaveBtnIcon(isLoading, actionType)}
          </Button>
        </UserActionConfirmation>

        <UserActionConfirmation
          type="deleteSession"
          onConfirm={() => handleControl("delete")}
        >
          <Button variant="destructive" disabled={isLoading}>
            {getDeleteBtnIcon(isLoading, actionType)}
          </Button>
        </UserActionConfirmation>
      </div>
    </div>
  );
};

export default EditSessionControl;
