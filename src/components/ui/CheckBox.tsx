import React, { forwardRef } from "react";

interface CheckBoxProps {
  label: string;
  id: string;
  name?: string;
}

const CheckBox = forwardRef<HTMLInputElement, CheckBoxProps>(
  ({ label, id, name, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="h-4 w-4 rounded-md checked:bg-[#4990f9] ring-[#4990f9] focus:outline-none focus:ring-2 focus:ring-[#4990f9]"
          name={name}
          {...props}
        />
        <label htmlFor={id} className="ml-2 text-sm sm:text-base cursor-pointer">
          {label}
        </label>
      </div>
    );
  }
);

CheckBox.displayName = "CheckBox";

export default CheckBox;
