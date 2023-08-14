import { FC, TextareaHTMLAttributes, KeyboardEvent, useRef } from "react";

interface CustomTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const CustomTextArea: FC<CustomTextAreaProps> = ({
  className,
  rows,
  value,
  onChange,
  name,
}: CustomTextAreaProps) => {
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const startPos = e.currentTarget.selectionStart;
      const endPos = e.currentTarget.selectionEnd;
      const textareaValue = e.currentTarget.value;
      const tabSize = "    ";

      const newValue =
        textareaValue.slice(0, startPos) +
        tabSize +
        textareaValue.slice(endPos);

      e.currentTarget.value = newValue;
      onChange;
      e.currentTarget.selectionStart = startPos + 4;
      e.currentTarget.selectionEnd = startPos + 4;
    }
  };

  return (
    <textarea
      name={name}
      onKeyDown={handleKeyPress}
      onChange={onChange}
      value={value || ""}
      rows={rows || 10}
      className={`w-full outline-0 p-1 bg-secondary caret-foreground border-input border ${className}`}
    />
  );
};

export default CustomTextArea;
