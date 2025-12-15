import React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  rows?: number;
}

/**
 * Simple textarea with Tailwind styling consistent with Input component.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        {...props}
        className={
          "w-full rounded-lg border bg-white/50 px-3 py-2 text-sm placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-400 " +
          className
        }
      />
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
