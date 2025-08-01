"use client";

import React from "react";
import useLoader from "./hooks/useLoader";

export type LoaderSize = "SMALL" | "MEDIUM" | "LARGE";
export type LoaderColor = "PRIMARY" | "LIGHT" | "DARK";

export interface LoaderProps {
  size?: LoaderSize;
  color?: LoaderColor;
  extraClass?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = "MEDIUM",
  color = "PRIMARY",
  extraClass = "",
  fullScreen = false,
}) => {
  const { getLoaderSize, getLoaderColor } = useLoader();
  const loaderClasses = `${getLoaderSize(size)} ${getLoaderColor(
    color
  )} rounded-full animate-spin ${extraClass}`;

  if (fullScreen) {
    return (
      <div
        data-testid="fullscreen-loader"
        className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
      >
        <div className={loaderClasses} role="status"></div>
      </div>
    );
  }

  return <div className={loaderClasses} role="status"></div>;
};

export default Loader;
