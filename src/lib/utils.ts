import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import alerts from "@/text/alerts.json";
import { ControlText, EditorData, JSONValue, Timer } from "@/src/types";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const retrieveTextFromJson = (
  keyName: ControlText["action"]
): { title: string; description: string } => {
  const text = alerts[keyName];
  return { title: text.title, description: text.description };
};

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

interface uploadFileProps {
  file: File;
  setUploadProgress: (progress: number) => void;
  setImgUrls: (urls: { imgUrl: string; deleteUrl: string }) => void;
  setError: (errorState: { hasError: boolean; message: string }) => void;
}

export const uploadFile = async ({
  file,
  setUploadProgress,
  setImgUrls,
  setError,
}: uploadFileProps) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", "00dacc9c1e93806b67618c3a2ca36fb8");
  try {
    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.floor((loaded / (total || 1)) * 100);
          setUploadProgress(progress);
        },
      }
    );

    if (!(response.status === 200)) {
      throw new Error("Something went wrong");
    }

    console.log("File uploaded:");
    console.log(response.data);
    setImgUrls({
      imgUrl: response.data.data.url,
      deleteUrl: response.data.data.delete_url,
    });
  } catch (error) {
    if (error instanceof Error) {
      setError({ hasError: true, message: error.message });
    } else {
      setError({ hasError: true, message: "An unexpected error occurred." });
    }
  }
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
    | undefined
): string | JSONValue {
  if (!topic) {
    return "";
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
