"use client";

import { FC, useEffect, useState } from "react";
import React from "react";
import ImageUploadItem from "./ImageUploadItem";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";

interface ImageUploadProps {}

const ImageUpload: FC<ImageUploadProps> = ({}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [validFile, setValidFile] = useState<File[]>([]);

  const inputFileRef = React.createRef<HTMLInputElement>();

  const onClickHandler = () => {
    inputFileRef.current?.click();
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovered(false);
  };

  const onFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovered(false);
    onFileHandler(e.dataTransfer.files);
  };

  const extensionValidation = (file: File) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/x-icon",
      "image/bmp",
      "image/webp",
      "image/svg+xml",
    ];

    if (!(file.type && validTypes.includes(file.type))) {
      setErrorMessage("File type not permitted");
      return false;
    }
    return true;
  };

  const sizeValidation = (fileSize: number) => {
    if (fileSize === 0 || fileSize > 30000000) {
      setErrorMessage(
        `${
          fileSize === 0 ? "File size is 0" : "File size is greater than 30MB"
        }`
      );
      return false;
    }
    return true;
  };

  const duplicateNameValidation = (fileName: String) => {
    const isDuplicate = validFile.find((file) => file.name === fileName);
    if (isDuplicate) {
      setErrorMessage("Duplicate file name");
      return false;
    }
    return true;
  };

  const fileValidation = (file: File) => {
    const isValid =
      extensionValidation(file) &&
      sizeValidation(file.size) &&
      duplicateNameValidation(file.name);
    return isValid;
  };

  const onFileHandler = (files: FileList | null = null) => {
    if (!files) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      if (fileValidation(files[i])) {
        setValidFile((prev) => [...prev, files[i]]);
      }
    }
  };

  return (
    <>
      <div
        className={`container w-full border-2 border-secondary-foreground border-dashed mt-5 flex flex-col justify-center items-center p-6 rounded-lg hover:cursor-pointer ${
          isHovered && "border-4"
        }`}
        onClick={onClickHandler}
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDrop={onFileDrop}
        onChange={() => onFileHandler(inputFileRef.current?.files)}
      >
        <h2 className="text-xl font-bold text-secondary-foreground">
          Upload Images
        </h2>
        <p className="text-secondary-foreground text-sm mt-1">
          (Click or drag an image to upload)
        </p>
        <input type="file" multiple className="hidden" ref={inputFileRef} />
      </div>
      <ul className="container flex flex-wrap justify-center mt-4">
        {validFile.length > 0 &&
          validFile.map(
            (file) => (
              console.log("validFile.map: "),
              console.log(file),
              (
                <ImageUploadItem
                  key={file.name}
                  file={file}
                  setValidFile={setValidFile}
                />
              )
            )
          )}
      </ul>
    </>
  );
};

export default ImageUpload;
