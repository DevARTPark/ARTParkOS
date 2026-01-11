// import React from "react";
import { Input } from "../ui/Input";

interface FormInput {
  label: string;
  field: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

interface FormSlideProps {
  inputs: FormInput[];
  values: any;
  onUpdate: (path: string, value: string) => void;
}

export default function FormSlide({
  inputs,
  values,
  onUpdate,
}: FormSlideProps) {
  const getValue = (path: string) => {
    return (
      path
        .split(".")
        .reduce(
          (obj, key) => (obj && obj[key] !== undefined ? obj[key] : ""),
          values
        ) || ""
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {inputs.map((input) => (
        <Input
          key={input.field}
          label={input.label}
          type={input.type || "text"}
          placeholder={input.placeholder}
          value={getValue(input.field)}
          onChange={(e) => onUpdate(input.field, e.target.value)}
          required={input.required}
        />
      ))}
    </div>
  );
}
