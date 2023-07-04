import { FC } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  type?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const FormField: FC<FormFieldProps> = ({
  name,
  label,
  value,
  type = "text",
  error,
  onChange,
  className,
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
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
};

export default FormField;
