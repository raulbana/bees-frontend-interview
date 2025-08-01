"use client";

import React from "react";
import { useCheckbox } from "./hooks/useCheckbox";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  extraClasses?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label = "Are you older than 18 years old?",
  checked,
  onChange,
  extraClasses = "",
  ...rest
}) => {
  const { handleChange } = useCheckbox({ onChange });

  return (
    <div className={`flex items-center ${extraClasses}`}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="appearance-none w-5 h-5 bg-white rounded border-2 border-checkbox-gray checked:bg-black checked:border-white cursor-pointer"
          {...rest}
        />
        <svg
          className={`absolute pointer-events-none left-[1px] ${
            checked ? "opacity-100" : "opacity-0"
          }`}
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 13.5L4 10L3 11L7.5 15.5L17 6L16 5L7.5 13.5Z"
            fill="white"
            stroke="white"
            strokeWidth="1"
          />
        </svg>
      </div>
      {label && (
        <label className="ml-2 text-black cursor-pointer">{label}</label>
      )}
    </div>
  );
};

export default Checkbox;
