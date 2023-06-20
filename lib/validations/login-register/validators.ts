import validator from "validator";

// moved outside the useForm hook since they do not depend on the component's state or props.
// otherwise they would be recreated each time the component renders
export const validateEmail = (value: string) => {
    const isValid = validator.isEmail(value);
    if (!isValid) return "Invalid email";
    return undefined;
  };

export const validatePassword = (value: string) => {
    const isValid = value.length > 6;
    if (!isValid) return "Invalid password";
    return undefined;
  };

export const validatePasswordEquality = (value: string, password?: string) => {
    if (!password) return "Passwords do not match";
    const isValid = validator.equals(value, password);
    if (!isValid) return "Passwords do not match";
    return undefined;
  };

export const validateUsername = (value: string) => {
    const isValid = value.length > 3;
    if (!isValid) return "Invalid username";
    return undefined;
  }

const checkIfFalsy = (value: any) => {
  if (!value || typeof value !== "string" ||value.trim().length === 0) {
    return "";
  }
  return value;
}
