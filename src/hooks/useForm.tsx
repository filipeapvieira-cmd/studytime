import { useState } from "react";
import validator from "validator";

type LoginFormError = {
  email?: string | undefined;
  password?: string | undefined;
  confirmPassword?: string | undefined;
};

export const useForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<LoginFormError>({});
  const [isFormDirty, setIsFormDirty] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (!isFormDirty) return;

    switch (name) {
      case "email":
        handleValidationErrors(name, validateEmail(value));
        break;
      case "password":
        handleValidationErrors(name, validatePassword(value));
        break;
      case "confirmPassword":
        handleValidationErrors(
          name,
          validatePasswordEquality(value, form.password)
        );
        break;
    }
  };

  const validateEmail = (value: string) => {
    const isValid = validator.isEmail(value);
    if (!isValid) return "Invalid email";
    return undefined;
  };

  const validatePassword = (value: string) => {
    const isValid = value.length > 6;
    if (!isValid) return "Invalid password";
    return undefined;
  };

  const validatePasswordEquality = (value: string, password: string) => {
    const isValid = validator.equals(value, password);
    if (!isValid) return "Passwords do not match";
    return undefined;
  };

  const handleValidationErrors = (
    name: string,
    message: string | undefined
  ) => {
    if (message) {
      setErrors((prev) => ({
        ...prev,
        [name]: message,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    handleValidationErrors("email", validateEmail(form.email));
    handleValidationErrors("password", validatePassword(form.password));
    handleValidationErrors(
      "confirmPassword",
      validatePasswordEquality(form.confirmPassword, form.password)
    );
    setIsFormDirty(true);
  };

  return {
    form,
    errors,
    handleChange,
    validateForm,
  };
};
