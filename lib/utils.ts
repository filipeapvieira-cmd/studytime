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