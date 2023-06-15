"use client";

import { FC, useContext, useEffect, useState } from "react";
import React from "react";
import ImageUploadItem from "./ImageUploadItem";
import { useToast } from "@/components/ui/use-toast";
import { UploadImagesContext } from "@/src/ctx/upload-images-provider";
import { useValidation } from "@/lib/imgUploadUtils";

interface ImageUploadProps {}

const ImageUpload: FC<ImageUploadProps> = ({}) => {
  const { validFile, setValidFile } = useContext(UploadImagesContext);
  const [isHovered, setIsHovered] = useState(false);
  const { isValid } = useValidation(validFile);

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

  const onFileHandler = (files: FileList | null = null) => {
    if (!files) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      if (isValid(files[i])) {
        setValidFile((prev) => [...prev, files[i]]);
      }
    }
  };

  return (
    <>
      <div
        className={`container mt-6 w-full border-2 border-secondary-foreground border-dashed flex flex-col justify-center items-center p-6 rounded-lg hover:cursor-pointer ${
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
      <ul className="container flex flex-wrap justify-center mt-2 p-4">
        {validFile.length > 0 &&
          validFile.map((file) => (
            <ImageUploadItem
              key={file.name}
              file={file}
              setValidFile={setValidFile}
            />
          ))}
      </ul>
    </>
  );
};

export default ImageUpload;
