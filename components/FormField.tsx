import { FC } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  type?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormField: FC<FormFieldProps> = ({
  name,
  label,
  value,
  type = "text",
  error,
  onChange,
  onBlur,
}) => {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;
