import { useEffect, useState } from "react";
import { defaultErrorState } from "@/src/lib/validations/login-register/rules";
import type { ErrorState, FormState, ValidationRules } from "@/src/types";

interface useFormProps {
  initialFormState: FormState;
  validationRules: ValidationRules;
}

export const useForm = ({
  initialFormState,
  validationRules,
}: useFormProps) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState<ErrorState>(defaultErrorState);
  const [hasTriedSubmission, setHasTriedSubmission] = useState(false);

  useEffect(() => {
    /* 
    We don't want to show error messages to the user until they have tried to submit the form.
    Also, we can only validate the form after it has been updated from the async setter call.
    */
    if (!hasTriedSubmission) return;
    validateForm();
  }, [form, hasTriedSubmission]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleValidationErrors = (errorObj: ErrorState) => {
    if (hasErrors(errorObj)) {
      setErrors(errorObj);
    } else {
      setErrors(defaultErrorState);
    }
  };

  const validateForm = (): ErrorState => {
    const errorObj: ErrorState = { ...defaultErrorState };

    for (const field in form) {
      const validationMethod = validationRules[field];

      const errorObjKey = field as keyof ErrorState;
      const formObjKey = field as keyof FormState;

      if (field === "confirmPassword") {
        errorObj[errorObjKey] = validationMethod(
          form[formObjKey] || "",
          form.password || "",
        );
      } else {
        errorObj[errorObjKey] = validationMethod(form[formObjKey] || "");
      }
    }

    handleValidationErrors(errorObj);
    setHasTriedSubmission(true);
    return errorObj;
  };

  const hasErrors = (errorObj: ErrorState) => {
    // check if any value in the errors object is truthy.
    // some(), tests whether at least one element in the array satisfies the provided callback function.
    return Object.values(errorObj).some((error) => error);
  };

  const isFormValid = () => {
    return !hasErrors(errors);
  };

  const resetForm = () => {
    setForm(initialFormState);
    setErrors(defaultErrorState);
    setHasTriedSubmission(false);
  };

  return {
    form,
    errors,
    handleChange,
    validateForm,
    isFormValid,
    hasErrors,
    resetForm,
  };
};
