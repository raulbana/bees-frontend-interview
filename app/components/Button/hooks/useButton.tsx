import { ButtonSize, ButtonType } from "../Button";

export const useButton = (type: ButtonType, size: ButtonSize) => {
  const getButtonColor = () => {
    switch (type) {
      case "PRIMARY":
        return "bg-black hover:bg-gray-800 text-primary-yellow border-0";
      case "DISABLED":
        return "bg-disabled-gray disabled text-white cursor-not-allowed border-0";
      default:
        return "bg-black hover:bg-gray-800 text-primary-yellow border-0";
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case "SMALL":
        return "p-2";
      case "MEDIUM":
        return "p-3";
      case "LARGE":
        return "p-4";
    }
  };

  return {
    getButtonColor,
    getButtonSize,
  };
};
