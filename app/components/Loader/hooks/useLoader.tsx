import { LoaderColor, LoaderSize } from "../Loader";

const useLoader = () => {
  const getLoaderSize = (size: LoaderSize) => {
    switch (size) {
      case "SMALL":
        return "w-5 h-5 border-2";
      case "MEDIUM":
        return "w-8 h-8 border-3";
      case "LARGE":
        return "w-12 h-12 border-4";
      default:
        return "w-8 h-8 border-3";
    }
  };

  const getLoaderColor = (color: LoaderColor) => {
    switch (color) {
      case "PRIMARY":
        return "border-primary-yellow border-t-black";
      case "LIGHT":
        return "border-white border-t-primary-yellow";
      case "DARK":
        return "border-gray-800 border-t-primary-yellow";
      default:
        return "border-primary-yellow border-t-black";
    }
  };

  return {
    getLoaderSize,
    getLoaderColor,
  };
};

export default useLoader;
