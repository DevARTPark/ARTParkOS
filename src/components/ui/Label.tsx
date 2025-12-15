import React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  className?: string;
}

/**
 * Lightweight Label component. Use wherever a label is needed.
 */
export const Label: React.FC<LabelProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <label
      {...props}
      className={`block text-sm font-medium text-slate-700 ${className}`}
    >
      {children}
    </label>
  );
};

export default Label;
