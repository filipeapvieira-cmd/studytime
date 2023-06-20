import { ValidationRules } from "@/types";
import {
  validateEmail,
  validatePassword,
  validatePasswordEquality,
  validateUsername,
} from "@/lib/validations/login-register/validators";

export const loginFormRules: ValidationRules = {
    email: validateEmail,
    password: validatePassword,
  };

export const registerFormRules: ValidationRules = {
    name: validateUsername,
    email: validateEmail,
    password: validatePassword,
    confirmPassword: validatePasswordEquality,
  };

export const loginFormFields = {
    email: "",
    password: "",
  };

export const registerFormFields = {
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