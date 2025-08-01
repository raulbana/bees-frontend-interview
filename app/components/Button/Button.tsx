"use client";

import React from "react";
import { useButton } from "./hooks/useButton";

export type ButtonType = "PRIMARY" | "DISABLED";

export type ButtonSize = "SMALL" | "MEDIUM" | "LARGE";

export type IconPosition = "LEFT" | "RIGHT";

export interface ButtonProps {
  text?: string;
  onClick?: (param?: any) => void;
  type?: ButtonType;
  disabled?: boolean;
  extraClass?: string;
  size?: ButtonSize;
  typeButton?: "button" | "submit" | "reset";
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = "PRIMARY",
  disabled = false,
  size = "MEDIUM",
  extraClass = "",
  typeButton,
  children,
}) => {
  const { getButtonColor, getButtonSize } = useButton(type, size);

  return (
    <button
      className={`w-full flex items-center justify-center gap-2 ${getButtonColor()} ${getButtonSize()} rounded-lg ${extraClass} cursor-pointer`}
      onClick={onClick}
      disabled={disabled}
      type={typeButton ?? "button"}
    >
      {text && <span>{text}</span>}
      {children}
    </button>
  );
};

export default Button;