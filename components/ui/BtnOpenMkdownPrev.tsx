import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface BtnOpenMkdownPrevProps {
  handleOpenPreviewer: () => void;
  isMarkdownPreviewerVisible: boolean;
}

const BtnOpenMkdownPrev: FC<BtnOpenMkdownPrevProps> = ({
  handleOpenPreviewer,
  isMarkdownPreviewerVisible,
}) => {
  return (
    <Button
      onClick={handleOpenPreviewer}
      className="self-center m-2"
      size={"icon"}
    >
      {/* Add your arrow image or icon here */}
      {isMarkdownPreviewerVisible ? <Icons.arrowRight /> : <Icons.arrowLeft />}
    </Button>
  );
};

export default BtnOpenMkdownPrev;
