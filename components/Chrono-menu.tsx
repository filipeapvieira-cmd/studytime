import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ChronoMenuProps {
  isActive: boolean;
  closeBtnRef: React.RefObject<HTMLButtonElement>;
}

const ChronoMenu: FC<ChronoMenuProps> = ({ isActive, closeBtnRef }) => {
  const closePopover = () => {
    closeBtnRef?.current?.click();
  };

  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Timer</h4>
        <p className="text-sm text-muted-foreground">
          Activate countdown timer feature.
        </p>
      </div>
      <div className="grid gap-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="minutes">Minutes</Label>
          <Input
            type="number"
            id="minutes"
            defaultValue="0"
            className="col-span-2 h-8"
          />
        </div>
        <Button variant="default" onClick={closePopover}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default ChronoMenu;
