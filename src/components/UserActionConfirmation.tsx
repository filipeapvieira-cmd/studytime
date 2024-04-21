import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

import React, { FC } from "react";
import { Button } from "@/src/components/ui/button";
import { Icons } from "@/src/components/icons";
import { retrieveTextFromJson } from "@/src/lib/utils";

interface UserActionConfirmationProps {
  children: React.ReactNode;
  type:
    | "restartSession"
    | "stopSession"
    | "saveSession"
    | "updateSession"
    | "deleteSession";
  onConfirm: () => void;
}

const UserActionConfirmation: FC<UserActionConfirmationProps> = ({
  children,
  onConfirm,
  type,
}) => {
  const { title, description } = retrieveTextFromJson(type);
  const checkColor = type === "deleteSession" ? "red" : "green";
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80" side="left">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="grid col-span-2">
            <Button onClick={onConfirm} size="sm" variant="outline">
              <Icons.check stroke={checkColor} />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserActionConfirmation;
