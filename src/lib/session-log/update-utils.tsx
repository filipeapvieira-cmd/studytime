import { MutableRefObject } from "react";
import { Icons } from "@/src/components/icons";

export const timeStringToDate = (
  sessionTime: string,
  sessionDate: string
): number => {
  const [year, month, day] = sessionDate.split("-").map(Number);
  const [hours, minutes, seconds] = sessionTime.split(":").map(Number);
  // Months in JavaScript are zero-based (0 - 11), so subtract 1 from the month value
  const date = new Date(year, month - 1, day, hours, minutes, seconds);

  return date.getTime();
};

export const timeStringToMillis = (pauseDuration: string): any => {
  const [hours, minutes, seconds] = pauseDuration.split(":").map(Number);
  const totalMilliseconds =
    hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;
  return totalMilliseconds;
};

export const getSaveBtnIcon = (
  isLoading: boolean,
  actionType: MutableRefObject<string>
) => {
  if (isLoading && actionType.current === "update") {
    return <Icons.loading className="h-6 w-6 animate-spin" />;
  }
  return <Icons.save />;
};

export const getDeleteBtnIcon = (
  isLoading: boolean,
  actionType: MutableRefObject<string>
) => {
  if (isLoading && actionType.current === "delete") {
    return <Icons.loading className="h-6 w-6 animate-spin" />;
  }
  return <Icons.close />;
};
