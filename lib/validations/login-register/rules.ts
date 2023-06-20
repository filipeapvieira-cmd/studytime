import { ValidationRules } from "@/types";
import {
  validateEmail,
  validatePassword,
  validatePasswordEquality,
  validateUsername,
} from "@/lib/validations/login-register/validators";

const loginFormRules: ValidationRules = {
    email: validateEmail,
    password: validatePassword,
  };

const registerFormRules: ValidationRules = {
    name: validateUsername,
    email: validateEmail,
    password: validatePassword,
    confirmPassword: validatePasswordEquality,
  };

const loginFormFields = {
    email: "",
    password: "",
  };

const registerFormFields = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

export const defaultErrorState = {
    name: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
}

export const formFieldsAndRules = (type: "login" | "register") => {
  return type === "login"
      ? { initialFormState: loginFormFields, validationRules: loginFormRules }
      : {
          initialFormState: registerFormFields,
          validationRules: registerFormRules,
        };
}