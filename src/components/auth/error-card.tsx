import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";
import CardWrapper from "./card-wrapper";

export default function ErrorCard() {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong."
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full items-center justify-center flex">
        <ExclamationTriangleIcon className="text-destructive" />
      </div>
    </CardWrapper>
  );
}
