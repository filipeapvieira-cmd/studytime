import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  type ControlText,
  type EditorData,
  type JSONValue,
  Timer,
} from "@/src/types";
import alerts from "@/text/alerts.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const retrieveTextFromJson = (
  keyName: ControlText["action"],
): { title: string; description: string } => {
  const text = alerts[keyName];
  return { title: text.title, description: text.description };
};

// Helper function to check if a value is a valid integer
export function isValidInteger(value: string | undefined): boolean {
  return value !== undefined && !isNaN(parseInt(value));
}

export const getFeelingsDisplayName = (feeling: string) => {
  return feeling.charAt(0) + feeling.slice(1).toLowerCase().replace("_", " ");
};

export function getTopicContent(
  topic:
    | {
        description?: string;
        contentJson?: JSONValue;
      }
    | undefined,
): string | JSONValue {
  if (!topic) {
    throw new Error("Topic not found");
  }
  if (topic.contentJson) {
    return topic.contentJson;
  }
  return topic.description ?? "";
}

// Utility function to normalize content for EditorJS
export const prepareContent = (value: string | JSONValue): EditorData => {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed as EditorData;
    } catch (error) {
      // Legacy plain text: wrap it in a paragraph block.
      return {
        time: Date.now(),
        blocks: [
          {
            type: "paragraph",
            data: {
              text: value,
            },
          },
        ],
        version: "2.22.2",
      };
    }
  } else {
    return value as EditorData;
  }
};
