import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";
import CardWrapper from "./card-wrapper";

export default function NotAuthorizedCard() {
  return (
    <div className="flex justify-center items-center flex-1">
      <CardWrapper
        headerLabel="Oops! Access Denied."
        backButtonHref="/dashboard"
        backButtonLabel="Back to Dashboard"
      >
        <div className="w-full items-center justify-center flex">
          <ExclamationTriangleIcon className="text-destructive" />
        </div>
      </CardWrapper>
    </div>
  );
}
