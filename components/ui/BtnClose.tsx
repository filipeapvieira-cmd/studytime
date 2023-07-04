import { FC } from "react";
import { Button } from "./button";
import { Icons } from "../icons";

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
