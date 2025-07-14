import type { InputHTMLAttributes } from "react";
import"./styles.css";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function TextInput({ ...props }: TextInputProps) {
  return (
    <div>
      <input className="input" {...props} />
    </div>
  );
}
