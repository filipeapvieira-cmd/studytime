import { useState } from "react";

export const useDragAndDrop = () => {
    const [isHovered, setIsHovered] = useState(false);

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovered(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, callback: Function) => {
    e.preventDefault();
    setIsHovered(false);
    callback(e.dataTransfer.files);
  };

  return {
    isHovered,
    handleDragIn,
    handleDragOut,
    handleDrop,
  };
}