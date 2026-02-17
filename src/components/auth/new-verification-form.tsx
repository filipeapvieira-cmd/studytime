"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BeatLoader } from "react-spinners";
import FormError from "../form-error";
import CardWrapper from "./card-wrapper";

function VerificationContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // If there is no error, the API route is still processing or will redirect.
  // Show a loader while the user waits.
  if (!error) {
    return <BeatLoader />;
  }

  return (
    <>
      <FormError message={error}></FormError>
    </>
  );
}

export function NewVerificationForm() {
  return (
    <div className="flex justify-center items-center flex-1">
      <CardWrapper
        headerLabel="Confirming your verification"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
        className="min-h-[400px]"
      >
        <div className="flex items-center justify-center w-full flex-1">
          <Suspense fallback={<BeatLoader />}>
            <VerificationContent />
          </Suspense>
        </div>
      </CardWrapper>
    </div>
  );
}
