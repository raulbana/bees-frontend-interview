import { useState, useEffect } from 'react';
import { AlertType } from '../Alert';

interface UseAlertProps {
  type: AlertType;
  position: string;
  duration: number;
  show: boolean;
  onClose?: () => void;
}

export const useAlert = ({ type, position, duration, show, onClose }: UseAlertProps) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(() => {
        onClose();
      }, 300); 
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "ERROR":
        return "bg-red-100 border-red-400 text-red-700";
      case "SUCCESS":
        return "bg-green-100 border-green-400 text-green-700";
      case "WARNING":
        return "bg-yellow-100 border-yellow-400 text-yellow-700";
      case "INFO":
        return "bg-blue-100 border-blue-400 text-blue-700";
      default:
        return "bg-red-100 border-red-400 text-red-700";
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case "top-right":
        return "top-4 right-4";
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "top-center":
        return "top-4 left-1/2 -translate-x-1/2";
      case "bottom-center":
        return "bottom-4 left-1/2 -translate-x-1/2";
      default:
        return "top-4 right-4";
    }
  };

  return {
    isVisible,
    handleClose,
    typeStyles: getTypeStyles(),
    positionStyles: getPositionStyles()
  };
};