import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>}
      <input className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>;
}
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export function Textarea({
  label,
  error,
  className = '',
  ...props
}: TextareaProps) {
  return <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>}
      <textarea className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>;
}