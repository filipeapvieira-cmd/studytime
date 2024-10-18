"use client";

import CardWrapper from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/src/actions/new-verification";
import FormSuccess from "../form-success";
import FormError from "../form-error";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Token not found");
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex justify-center items-center flex-1">
      <CardWrapper
        headerLabel="Confirming your verification"
        backButtonLabel="Back to login"
        backButtonHref="/auth/login"
        className="min-h-[400px]"
      >
        <div className="flex items-center justify-center w-full flex-1">
          {!success && !error && <BeatLoader />}
          <FormSuccess message={success}></FormSuccess>
          <FormError message={error}></FormError>
        </div>
      </CardWrapper>
    </div>
  );
};
