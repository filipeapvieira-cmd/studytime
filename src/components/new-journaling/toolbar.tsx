import React from "react";
import EditSessionToolbar from "../EditSessionControl";
import { SessionToolbar } from "./session-toolbar";

interface ToolbarProps {
  onClose?: (isOpen: boolean) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onClose }) => {
  const isUpdate = !!onClose;
  return isUpdate ? (
    <EditSessionToolbar setIsModalOpen={onClose} />
  ) : (
    <SessionToolbar />
  );
};

export default Toolbar;
