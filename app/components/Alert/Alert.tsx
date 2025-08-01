"use client";

import React from "react";
import { useAlert } from "./hooks/useAlert";

export type AlertType = "ERROR" | "SUCCESS" | "WARNING" | "INFO";

export interface AlertProps {
  type?: AlertType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
  show?: boolean;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

const Alert: React.FC<AlertProps> = ({
  type = "ERROR",
  title,
  message,
  duration = 5000,
  onClose,
  show = true,
  position = "top-center",
}) => {
  const { isVisible, handleClose, typeStyles, positionStyles } = useAlert({
    type,
    position,
    duration,
    show,
    onClose,
  });

  if (!isVisible) return null;

  return (
    <div
      className={`fixed ${positionStyles} z-50 transform transition-all duration-300 ease-in-out opacity-100 translate-y-0 shadow-lg max-w-sm`}
      role="alert"
    >
      <div className={`rounded-lg border-l-4 ${typeStyles} p-4`}>
        <div className="flex items-center">
          <div className="ml-3">
            {title && <h3 className="font-medium">{title}</h3>}
            <div className="text-sm">{message}</div>
          </div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex focus:outline-none"
            onClick={handleClose}
            aria-label="Close"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
