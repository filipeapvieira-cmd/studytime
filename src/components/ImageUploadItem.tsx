import { FC, useState, useEffect } from "react";
import {
  FileExtension,
  FileInfo,
  FileOptions,
} from "@/src/components/ImageUploadItemLib";
import { uploadFile } from "@/src/lib/utils";
import { useToast } from "@/src/components/ui/use-toast";

interface ImageUploadItemProps {
  file: File;
  setValidFile: (file: File[] | ((prevState: File[]) => File[])) => void;
}

const ImageUploadItem: FC<ImageUploadItemProps> = ({ file, setValidFile }) => {
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imgUrls, setImgUrls] = useState({ imgUrl: "", deleteUrl: "" });
  const [error, setError] = useState({ hasError: false, message: "" });

  useEffect(() => {
    uploadFile({ file, setUploadProgress, setImgUrls, setError });
  }, [file]);

  useEffect(() => {
    if (error.hasError) {
      toast({
        variant: "destructive",
        title: `Uh oh! Something went wrong: ${file.name}`,
        description: `${error.message}`,
      });
      setError({ hasError: false, message: "" });
      setValidFile((prevState) => {
        return prevState.filter((item) => item.name !== file.name);
      });
    }
  }, [error]);

  return (
    <>
      {!error.hasError && (
        <li className="w-[600px] p-2 flex space-x-5">
          <FileExtension fileType={file.type} />
          <FileInfo
            fileName={file.name}
            fileSize={file.size}
            progress={uploadProgress}
          />
          <FileOptions
            imgUrls={imgUrls}
            setValidFile={setValidFile}
            fileName={file.name}
          />
        </li>
      )}
    </>
  );
};

export default ImageUploadItem;
