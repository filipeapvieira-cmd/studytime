import type { FC } from "react";
import { Icons } from "@/src/components/icons";
import { Button } from "@/src/components/ui/button";

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
