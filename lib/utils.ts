import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import alerts from "@/text/alerts.json"
import { ControlText, SessionTimer } from "@/types"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const retrieveText = (keyName: ControlText["action"]): {title:string, description:string} => {
  const text = alerts[keyName];
  return {title: text.title, description: text.description};
}

export const calcSessionTimes = (sessionTimes: SessionTimer) => {
      const {currentTimeOfStudy, sessionStartTime} = sessionTimes;
      const sessionEndTime = Date.now();
      const totalElapsedTime = sessionEndTime - sessionStartTime;
      const totalPauseTime = totalElapsedTime - currentTimeOfStudy * 1000;
      return {sessionEndTime, totalPauseTime};
} 

export const getFileSize = (fileSize: number) => {
  const bytesInAKilobyte = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(fileSize) / Math.log(bytesInAKilobyte));
  return (
    parseFloat((fileSize / Math.pow(bytesInAKilobyte, index)).toFixed(2)) +
    " " +
    sizes[index]
  );
};