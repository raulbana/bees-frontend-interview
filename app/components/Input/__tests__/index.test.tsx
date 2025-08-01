import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Input, { InputError } from "../Input";

describe("Input Component", () => {
  test("renders input element with default props", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("renders input with provided type", () => {
    render(<Input type="email" data-testid="email-input" />);
    expect(screen.getByTestId("email-input")).toHaveAttribute("type", "email");
  });

  test("renders label when provided", () => {
    render(<Input label="Username" />);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  test("applies extra classes when provided", () => {
    render(<Input extraClasses="test-class" data-testid="styled-input" />);
    expect(screen.getByTestId("styled-input")).toHaveClass("test-class");
  });

  test("shows disabled styling when disabled", () => {
    render(<Input disabled data-testid="disabled-input" />);
    expect(screen.getByTestId("disabled-input")).toHaveClass("opacity-50");
    expect(screen.getByTestId("disabled-input")).toHaveClass(
      "cursor-not-allowed"
    );
  });

  test("renders placeholder text when provided", () => {
    render(<Input placeholder="Enter text here" />);
    expect(screen.getByPlaceholderText("Enter text here")).toBeInTheDocument();
  });

  test("handles change events correctly", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test value" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue("test value");
  });

  test("displays error messages when errors are provided", () => {
    const errors: InputError[] = [
      { hasError: true, message: "This field is required" },
    ];

    render(<Input error={errors} />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  test("does not display error messages when hasError is false", () => {
    const errors: InputError[] = [
      { hasError: false, message: "This field is required" },
    ];

    render(<Input error={errors} />);
    expect(
      screen.queryByText("This field is required")
    ).not.toBeInTheDocument();
  });

  test("displays multiple error messages when provided", () => {
    const errors: InputError[] = [
      { hasError: true, message: "This field is required" },
      { hasError: true, message: "Must be at least 8 characters" },
    ];

    render(<Input error={errors} />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(
      screen.getByText("Must be at least 8 characters")
    ).toBeInTheDocument();
  });

  test("applies error styling to label when there are errors", () => {
    const errors: InputError[] = [
      { hasError: true, message: "This field is required" },
    ];

    render(<Input label="Username" error={errors} />);
    const label = screen.getByText("Username");
    expect(label).toHaveClass("text-red-500");
  });
});
