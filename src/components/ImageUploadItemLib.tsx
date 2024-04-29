import { Progress } from "@/src/components/ui/progress";
import { getFileSize } from "@/src/lib/utils";
import { Icons } from "@/src/components/icons";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";

interface FileExtensionProps {
  fileType: string;
}

interface FileInfoProps {
  fileName: string;
  fileSize: number;
  progress: number;
}

interface FileOptionsProps {
  fileName: string;
  imgUrls: { imgUrl: string; deleteUrl: string };
  setValidFile: (file: File[] | ((prevState: File[]) => File[])) => void;
}

export const FileExtension = ({ fileType }: FileExtensionProps) => {
  return (
    <div className="w-16 flex-shrink-0 h-12 bg-primary rounded-lg text-primary-foreground flex items-center justify-center p-1">
      {fileType.split("/")[1].toUpperCase()}
    </div>
  );
};

export const FileInfo = ({ fileName, fileSize, progress }: FileInfoProps) => {
  return (
    <div className="flex flex-col justify-between w-[420px]">
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

export const FileOptions = ({
  imgUrls,
  setValidFile,
  fileName,
}: FileOptionsProps) => {
  const [isCopyLoading, setIsCopyLoading] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      setIsCopyLoading(true);
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    } finally {
      setIsCopyLoading(false);
    }
  };

  // Code used for the deletion with puppeteer
  /*   const deleteImage = async (imgDeleteUrl: string) => {
    try {
      setIsDeleteLoading(true);
      const response = await fetch("/api/delete-img", {
        method: "POST",
        body: JSON.stringify({ imgDeleteUrl }),
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log("err");
    } finally {
      setIsDeleteLoading(false);
    }
  }; */

  const onCopyToClipboardHandler = async () => {
    await copyToClipboard(imgUrls.imgUrl);
  };

  const onDeleteHandler = async () => {
    window.open(imgUrls.deleteUrl, "_blank", "noopener,noreferrer");
    setValidFile((prev) => {
      return prev.filter((file) => file.name !== fileName);
    });
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      <Button
        variant="ghost"
        disabled={imgUrls.imgUrl === "" || isCopyLoading}
        onClick={onCopyToClipboardHandler}
        className="p-0 w-7 h-7"
      >
        {isCopyLoading ? (
          <Icons.loading className="animate-spin" />
        ) : (
          <Icons.copy />
        )}
      </Button>

      <Button
        variant="ghost"
        className="p-0"
        disabled={imgUrls.deleteUrl === ""}
        onClick={onDeleteHandler}
      >
        <Icons.close />
      </Button>
    </div>
  );
};
