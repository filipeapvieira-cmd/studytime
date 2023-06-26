import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import alerts from "@/text/alerts.json"
import { ControlText, SessionTimer } from "@/types"
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const retrieveTextFromJson = (keyName: ControlText["action"]): { title: string, description: string } => {
  const text = alerts[keyName];
  return { title: text.title, description: text.description };
}

export const calcSessionTimes = (sessionTimes: SessionTimer) => {
  const { effectiveTimeOfStudy, sessionStartTime } = sessionTimes;
  const sessionEndTime = Date.now();
  const totalElapsedTime = sessionEndTime - sessionStartTime;
  const totalPauseTime = totalElapsedTime - effectiveTimeOfStudy * 1000; // effectiveTimeOfStudy is calculated in seconds, so here needs to be converted to ms

  console.log("Total elapsed time: ", totalElapsedTime);

  return { sessionEndTime, totalPauseTime };
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

interface uploadFileProps {
  file: File;
  setUploadProgress: (progress: number) => void;
  setImgUrls: (urls: { imgUrl: string; deleteUrl: string }) => void;
  setError: (errorState: { hasError: boolean, message: string }) => void;
}

export const uploadFile = async ({ file, setUploadProgress, setImgUrls, setError }: uploadFileProps) => {
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