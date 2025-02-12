"use client";

import { FC, useRef } from "react";
import FormField from "@/src/components/FormField";
import { Button } from "./ui/button";
import ReactInputMask from "react-input-mask";
import UserActionConfirmation from "./UserActionConfirmation";
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
  getRequestBody,
  calculateEffectiveTime,
  validateEffectiveTime,
  validatePauseDuration,
  validateStudySession,
  isEndTimeEarlierThanStartTime,
} from "@/src/lib/session-log/update-utils";
import { mutate } from "swr";
import { Label } from "./ui/label";
import { useUpdateSessionContext } from "../ctx/update-session-provider";
import { Input } from "./ui/input";
import { useCustomToast } from "../hooks/useCustomToast";
import { editSessionToolbarSchema } from "../lib/schemas/editSessionControlSchema";

interface EditSessionToolbarProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const USER_ERROR_MESSAGE =
  "Invalid time fields provided. Please check start time, end time, and pause duration.";

const EditSessionToolbar: FC<EditSessionToolbarProps> = ({
  setIsModalOpen,
}: EditSessionToolbarProps) => {
  const {
    sessionToEdit,
    setSessionToEdit,
    sessionTopicsUpdate: sessionTopics,
    sessionFeelingsUpdate: sessionFeelings,
    error,
    setError,
  } = useUpdateSessionContext();
  const actionType = useRef("");
  const { isLoading, httpRequestHandler } = usePersistSession();
  const { showToast } = useCustomToast();

  if (!sessionToEdit) return null;

  const { startTime, pauseDuration, endTime, effectiveTime, id, date } =
    sessionToEdit;

  const hasError =
    error.startTime ||
    error.endTime ||
    error.pauseDuration ||
    error.effectiveTime;

  const onSuccess = () => {
    setIsModalOpen(false);
    mutate(GET_ALL_SESSIONS_ENDPOINT);
  };

  const handleControl = (action: "update" | "delete") => {
    actionType.current = "";
    console.log("sessionTopics", sessionTopics);

    if (action === "update") {
      const parseResult = editSessionToolbarSchema.safeParse({
        startTime,
        pauseDuration,
        endTime,
        effectiveTime,
      });

      if (!parseResult.success) {
        showToast({
          status: "error",
          message: USER_ERROR_MESSAGE,
        });
        return;
      }

      const studySessionValidation = validateStudySession({
        startTime,
        endTime,
        pauseDuration,
        sessionTopics,
      });

      if (studySessionValidation.error) {
        showToast({
          status: "error",
          message: studySessionValidation.error,
        });
        return;
      }
    }

    const body = getRequestBody({
      id,
      sessionFeelings,
      sessionTopics,
      date,
      startTime,
      endTime,
      pauseDuration,
    });
    const updateParameters = {
      body,
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

    setSessionToEdit((preValue) => {
      if (!preValue) return null;

      const updatedSession = {
        ...preValue,
        [name]: value,
      };

      if (
        isEndTimeEarlierThanStartTime(
          updatedSession.endTime,
          updatedSession.startTime
        )
      )
        return preValue;

      const isPauseValid = validatePauseDuration(updatedSession.pauseDuration);

      let effectiveTime = updatedSession.effectiveTime;

      if (isPauseValid) {
        const calculatedEffectiveTime = calculateEffectiveTime({
          startTime: updatedSession.startTime,
          endTime: updatedSession.endTime,
          pauseDuration: updatedSession.pauseDuration,
        });
        if (validateEffectiveTime(calculatedEffectiveTime)) {
          effectiveTime = calculatedEffectiveTime;
          setError((prevState) => ({
            ...prevState,
            pauseDuration: false,
            effectiveTime: false,
          }));
        } else {
          setError((prevState) => ({
            ...prevState,
            pauseDuration: true,
          }));
        }
      }

      return {
        ...updatedSession,
        effectiveTime,
      };
    });
  };

  return (
    <div className="flex items-center p-3 space-y-4 justify-between bg-zinc-900 rounded-t-xl">
      <div className="flex space-x-2 items-center">
        <FormField
          name="startTime"
          label="Start Time"
          type="time"
          value={startTime}
          onChange={(e) => handleOnChange(e)}
          className="max-w-[150px]"
        />
        <div className="max-w-[150px]">
          <Label
            htmlFor={pauseDuration}
            className={`${error.pauseDuration && "text-destructive font-bold"}`}
          >
            Pause Time
          </Label>
          <ReactInputMask
            name="pauseDuration"
            value={pauseDuration}
            mask="99:99:99"
            placeholder="HH:MM:SS"
            alwaysShowMask
            onChange={(e) => handleOnChange(e)}
            defaultValue="00:00:00"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <FormField
          name="endTime"
          label="End Time"
          type="time"
          value={endTime}
          onChange={(e) => handleOnChange(e)}
          className="max-w-[150px]"
        />
        <div className="max-w-[150px]">
          <Label
            htmlFor={effectiveTime}
            className={`${error.effectiveTime && "text-destructive font-bold"}`}
          >
            Effective Time
          </Label>
          <Input
            value={effectiveTime}
            type="text"
            name="effectiveTime"
            onChange={(e) => handleOnChange(e)}
            disabled={true}
          />
        </div>
      </div>
      <div className="flex gap-x-3">
        <UserActionConfirmation
          type="updateSession"
          onConfirm={() => handleControl("update")}
        >
          <Button disabled={isLoading || hasError}>
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

export default EditSessionToolbar;
