import type { FC } from "react";
import { Icons } from "../icons";
import { Button } from "./button";

interface BtnCloseProps {
  visible: any;
  onClick: () => void;
}

const BtnClose: FC<BtnCloseProps> = ({ visible, onClick }: BtnCloseProps) => {
  return visible ? (
    <Button size="sm" variant="destructive" onClick={onClick}>
      <Icons.close />
    </Button>
  ) : null;
};

export default BtnClose;
