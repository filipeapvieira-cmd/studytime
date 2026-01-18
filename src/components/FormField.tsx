import type { FC } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  type?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

const FormField: FC<FormFieldProps> = ({
  name,
  label,
  value,
  type = "text",
  error,
  onChange,
  className,
  disabled,
}) => {
  return (
    <div className={className}>
      <Label htmlFor={name} className={`${error && "text-destructive"}`}>
        {label}
      </Label>
      <Input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};

export default FormField;
