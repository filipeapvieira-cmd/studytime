"use client";

import { createContext, useState } from "react";

interface ContextProps {
  validFile: File[];
  setValidFile: (files: File[] | ((prevState: File[]) => File[])) => void;
}

export const uploadImagesCtxDefaultValues: ContextProps = {
  validFile: [],
  setValidFile: () => {},
};

export const UploadImagesContext = createContext<ContextProps>(
  uploadImagesCtxDefaultValues
);

export default function UploadImagesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [validFile, setValidFile] = useState<File[]>(
    uploadImagesCtxDefaultValues.validFile
  );

  return (
    <UploadImagesContext.Provider value={{ validFile, setValidFile }}>
      {children}
    </UploadImagesContext.Provider>
  );
}
