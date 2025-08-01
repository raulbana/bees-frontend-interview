import React from "react";
import { render, screen } from "@testing-library/react";
import Loader from "../Loader";
import useLoader from "../hooks/useLoader";

jest.mock("../hooks/useLoader", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("Loader Component", () => {
  const mockGetLoaderSize = jest.fn();
  const mockGetLoaderColor = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLoaderSize.mockReturnValue("w-8 h-8 border-3");
    mockGetLoaderColor.mockReturnValue("border-primary-yellow border-t-black");
    (useLoader as jest.Mock).mockReturnValue({
      getLoaderSize: mockGetLoaderSize,
      getLoaderColor: mockGetLoaderColor,
    });
  });

  test("renders loader with default props", () => {
    render(<Loader />);

    expect(mockGetLoaderSize).toHaveBeenCalledWith("MEDIUM");
    expect(mockGetLoaderColor).toHaveBeenCalledWith("PRIMARY");

    const loader = screen.getByRole("status");
    expect(loader).toHaveClass("w-8 h-8 border-3");
    expect(loader).toHaveClass("border-primary-yellow border-t-black");
    expect(loader).toHaveClass("rounded-full animate-spin");
  });

  test("renders loader with specific size", () => {
    mockGetLoaderSize.mockReturnValue("w-12 h-12 border-4");
    render(<Loader size="LARGE" />);

    expect(mockGetLoaderSize).toHaveBeenCalledWith("LARGE");

    const loader = screen.getByRole("status");
    expect(loader).toHaveClass("w-12 h-12 border-4");
  });

  test("renders loader with specific color", () => {
    mockGetLoaderColor.mockReturnValue("border-white border-t-primary-yellow");
    render(<Loader color="LIGHT" />);

    expect(mockGetLoaderColor).toHaveBeenCalledWith("LIGHT");

    const loader = screen.getByRole("status");
    expect(loader).toHaveClass("border-white border-t-primary-yellow");
  });

  test("renders loader with extra class", () => {
    render(<Loader extraClass="test-class" />);

    const loader = screen.getByRole("status");
    expect(loader).toHaveClass("test-class");
  });

  test("renders fullscreen loader", () => {
    render(<Loader fullScreen />);

    const overlay = screen.getByTestId("fullscreen-loader");
    expect(overlay).toHaveClass(
      "fixed inset-0 flex items-center justify-center bg-black/20 z-50"
    );

    const loader = screen.getByRole("status");
    expect(loader).toBeInTheDocument();
  });

  test("renders regular loader when fullScreen is false", () => {
    render(<Loader fullScreen={false} />);

    expect(screen.queryByTestId("fullscreen-loader")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
