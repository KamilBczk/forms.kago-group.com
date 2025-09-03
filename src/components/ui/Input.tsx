import React, { forwardRef } from "react";

interface InputProps {
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel" | "number" | "password" | "textarea";
  error?: string;
  name?: string;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  ({ label, placeholder, type = "text", error, name, ...props }, ref) => {
    const baseInputClasses = `w-full rounded-md border-1 ${
      error ? 'border-red-300' : 'border-gray-200'
    } bg-white text-sm text-gray-700 shadow-sm p-2 sm:p-3 ring-[#4990f9] focus:outline-none focus:ring-2`;

    if (type === "textarea") {
      return (
        <div className="flex flex-col gap-1">
          <label htmlFor={name} className="text-sm sm:text-base relative">
            {label}
          </label>
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            className={`${baseInputClasses} resize-none`}
            placeholder={placeholder}
            name={name}
            rows={3}
            {...props}
          />
          {error && <span className="text-red-500 text-xs">{error}</span>}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        <div className="relative">
          <label htmlFor={name} className="text-sm sm:text-base relative">
            {label}
          </label>
        </div>
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={baseInputClasses}
          placeholder={placeholder}
          name={name}
          type={type}
          {...props}
        />
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
