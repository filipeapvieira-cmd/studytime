import { type FC, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

interface ChronoMenuProps {
  closeBtnRef: React.RefObject<HTMLButtonElement>;
  start: (minutes: number) => void;
}

const ChronoMenu: FC<ChronoMenuProps> = ({ closeBtnRef, start }) => {
  const minutesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!("Notification" in window)) {
      //TODO: This option should be disabled if browser does not support
      // We should send a toast to the user
      console.log("Browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }, []);

  const startCounterHandler = () => {
    const minutes = Number(minutesInputRef.current?.value);
    start(minutes);
    closeBtnRef.current?.click();
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
            placeholder="0"
            className="col-span-2 h-8"
            ref={minutesInputRef}
          />
        </div>
        <Button variant="default" onClick={startCounterHandler}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default ChronoMenu;
