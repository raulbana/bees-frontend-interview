import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Alert from "../Alert";
import * as useAlertModule from "../hooks/useAlert";

jest.mock("../hooks/useAlert", () => {
  const originalModule = jest.requireActual("../hooks/useAlert");
  return {
    __esModule: true,
    ...originalModule,
    useAlert: jest.fn(),
  };
});

describe("Alert Component", () => {
  const mockUseAlert = {
    isVisible: true,
    handleClose: jest.fn(),
    typeStyles: "bg-red-100 border-red-400 text-red-700",
    positionStyles: "top-4 right-4",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAlertModule.useAlert as jest.Mock).mockReturnValue(mockUseAlert);
  });

  test("renders the alert with correct message", () => {
    render(<Alert message="Test alert message" />);
    expect(screen.getByText("Test alert message")).toBeInTheDocument();
  });

  test("renders the alert with title when provided", () => {
    render(<Alert message="Alert message" title="Alert Title" />);
    expect(screen.getByText("Alert Title")).toBeInTheDocument();
    expect(screen.getByText("Alert message")).toBeInTheDocument();
  });

  test("does not render when isVisible is false", () => {
    (useAlertModule.useAlert as jest.Mock).mockReturnValue({
      ...mockUseAlert,
      isVisible: false,
    });

    const { container } = render(<Alert message="Hidden alert" />);
    expect(container.firstChild).toBeNull();
  });

  test("calls handleClose when close button is clicked", () => {
    render(<Alert message="Closable alert" />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockUseAlert.handleClose).toHaveBeenCalledTimes(1);
  });

  test("passes correct props to useAlert hook", () => {
    const alertProps = {
      type: "SUCCESS" as const,
      message: "Success message",
      duration: 3000,
      show: true,
      position: "bottom-center" as const,
    };

    render(<Alert {...alertProps} />);

    expect(useAlertModule.useAlert).toHaveBeenCalledWith({
      type: "SUCCESS",
      position: "bottom-center",
      duration: 3000,
      show: true,
      onClose: undefined,
    });
  });

  test("renders with correct type styles", () => {
    (useAlertModule.useAlert as jest.Mock).mockReturnValue({
      ...mockUseAlert,
      typeStyles: "bg-green-100 border-green-400 text-green-700",
    });

    const { container } = render(
      <Alert type="SUCCESS" message="Success alert" />
    );
    const alertDiv = container.querySelector('[role="alert"] > div');

    expect(alertDiv).toHaveClass(
      "bg-green-100",
      "border-green-400",
      "text-green-700"
    );
  });

  test("renders with correct position styles", () => {
    (useAlertModule.useAlert as jest.Mock).mockReturnValue({
      ...mockUseAlert,
      positionStyles: "bottom-4 left-4",
    });

    const { container } = render(
      <Alert position="bottom-left" message="Positioned alert" />
    );
    const alertDiv = container.querySelector('[role="alert"]');

    expect(alertDiv).toHaveClass("bottom-4", "left-4");
  });
});
