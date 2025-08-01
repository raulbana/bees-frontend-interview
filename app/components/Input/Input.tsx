"use client";

import React from "react";

export type InputType =
  | "search"
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "datetime-local";

export interface InputError {
  hasError: boolean;
  message: string;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: InputType;
  label?: string;
  placeholder?: string;
  error?: InputError[];
  extraClasses?: string;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  label,
  placeholder = "",
  error = [],
  extraClasses = "",
  ...rest 
}) => {
  const hasError = error?.some((err) => err.hasError);

  return (
    <div className="flex flex-1 flex-col">
      {label && <label className={`text-sm mb-1 ${hasError ? "text-red-500" : "text-black"}`}>{label}</label>}
      <input
        className={`w-full bg-white text-medium-gray border-1 border-light-gray rounded-sm p-2 text-base focus:outline-none ${extraClasses} ${
          rest.disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        type={type}
        placeholder={placeholder}
        {...rest}
      />
      {hasError && (
        <div className="min-h-4 text-sm mt-1">
          {error
            ?.filter((err) => err.hasError)
            .map((err, index) => (
              <li
                key={`${err.message}-${index}`}
                className="text-xs ml-4 text-red-500"
              >
                {err.message}
              </li>
            ))}
        </div>
      )}
    </div>
  );
};

export default Input;