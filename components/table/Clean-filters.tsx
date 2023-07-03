import { FC } from "react";
import { Button } from "../ui/button";
import { Icons } from "../icons";

interface CleanFiltersProps {
  visible: any;
  onClick: () => void;
}

const CleanFilters: FC<CleanFiltersProps> = ({
  visible,
  onClick,
}: CleanFiltersProps) => {
  return visible ? (
    <Button size="sm" variant="destructive" onClick={onClick}>
      <Icons.close />
    </Button>
  ) : null;
};

export default CleanFilters;
