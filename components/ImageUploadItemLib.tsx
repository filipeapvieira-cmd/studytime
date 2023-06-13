import { Progress } from "@/components/ui/progress";
import { getFileSize } from "@/lib/utils";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <div className="w-16 h-12 bg-primary rounded-lg text-primary-foreground flex items-center justify-center p-1">
      {fileType.split("/")[1].toUpperCase()}
    </div>
  );
};

export const FileInfo = ({ fileName, fileSize, progress }: FileInfoProps) => {
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

export const FileOptions = ({
  imgUrls,
  setValidFile,
  fileName,
}: FileOptionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      setIsLoading(true);
      await navigator.clipboard.writeText(text);
      setIsLoading(false);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setIsLoading(false);
    }
  };

  const onCopyToClipboardHandler = async () => {
    await copyToClipboard(imgUrls.imgUrl);
  };

  const onDeleteHandler = () => {
    setValidFile((prev) => {
      return prev.filter((file) => file.name !== fileName);
    });
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      <Button
        variant="ghost"
        disabled={imgUrls.imgUrl === ""}
        onClick={onCopyToClipboardHandler}
        className="p-0 w-7 h-7"
      >
        {isLoading ? (
          <Icons.loading className="animate-spin" />
        ) : (
          <Icons.copy />
        )}
      </Button>

      <Button variant="ghost" asChild className="p-0">
        {imgUrls.deleteUrl !== "" ? (
          <Link
            target="_blank"
            href={imgUrls.deleteUrl}
            onClick={onDeleteHandler}
          >
            <Icons.close />
          </Link>
        ) : (
          <Icons.close
            width={24}
            height={24}
            className="stroke-muted-foreground"
          />
        )}
      </Button>
    </div>
  );
};
