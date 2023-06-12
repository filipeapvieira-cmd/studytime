import { FC, useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { getFileSize } from "@/lib/utils";
import { Icons } from "@/components/icons";
import axios from "axios";

interface ImageUploadItemProps {
  file: File;
}

interface FileExtensionProps {
  fileType: string;
}

interface FileInfoProps {
  fileName: string;
  fileSize: number;
  progress: number;
}

const FileExtension = ({ fileType }: FileExtensionProps) => {
  return (
    <div className="w-16 h-12 bg-primary rounded-lg text-primary-foreground flex items-center justify-center p-1">
      {fileType.split("/")[1].toUpperCase()}
    </div>
  );
};
const FileInfo = ({ fileName, fileSize, progress }: FileInfoProps) => {
  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="flex justify-between">
        <p className="whitespace-nowrap overflow-hidden overflow-ellipsis w-1/2">
          {fileName}
        </p>
        <p>{getFileSize(fileSize)}</p>
      </div>
      <Progress value={progress} />
    </div>
  );
};
const FileOptions = () => {
  return (
    <div className="flex space-x-3 justify-center items-center">
      <Icons.copy className="hover:cursor-pointer hover:stroke-slate-600" />
      <Icons.close className="hover:cursor-pointer hover:stroke-slate-600" />
    </div>
  );
};

const ImageUploadItem: FC<ImageUploadItemProps> = ({ file }) => {
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const uploadFile = async () => {
      console.log("useEffect");
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
      } catch (error) {
        console.log(error);
      }
    };
    uploadFile();
  }, [file]);

  return (
    <div className="w-[600px] bg-secondary p-2 flex space-x-5">
      <FileExtension fileType={file.type} />
      <FileInfo
        fileName={file.name}
        fileSize={file.size}
        progress={uploadProgress}
      />
      <FileOptions />
    </div>
  );
};

export default ImageUploadItem;
