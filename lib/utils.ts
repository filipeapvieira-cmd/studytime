import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import alerts from "@/text/alerts.json"
import { ControlText } from "@/types"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const retrieveText = (keyName: ControlText["action"]): {title:string, description:string} => {
  const text = alerts[keyName];
  return {title: text.title, description: text.description};
}