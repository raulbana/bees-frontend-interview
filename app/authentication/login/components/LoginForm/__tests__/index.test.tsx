import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "../LoginForm";
import useLoginForm from "../hooks/useLoginForm";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/store/userContext";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/store/userContext", () => ({
  useUserContext: jest.fn(),
}));

jest.mock("../hooks/useLoginForm", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("LoginForm Component", () => {
  const mockRouter = { push: jest.fn() };
  const mockLogin = jest.fn();
  const mockHandleNameChange = jest.fn();
  const mockHandleCheckboxChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useUserContext as jest.Mock).mockReturnValue({ login: mockLogin });
    (useLoginForm as jest.Mock).mockReturnValue({
      fullName: "",
      isOver18: false,
      isValid: false,
      isSubmitting: false,
      nameErrors: [],
      onSubmit: mockOnSubmit,
      handleNameChange: mockHandleNameChange,
      handleCheckboxChange: mockHandleCheckboxChange,
    });
  });

  test("renders form with correct elements", () => {
    render(<LoginForm />);

    expect(
      screen.getByText("Please, enter your full name below")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Only alphabetical characters are accepted")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your full name")).toBeInTheDocument();
    expect(
      screen.getByText("Are you older than 18 years old?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enter" })).toBeInTheDocument();
  });

  test("button is disabled when form is not valid", () => {
    render(<LoginForm />);

    const button = screen.getByRole("button", { name: "Enter" });
    expect(button).toBeDisabled();
  });

  test("button is enabled when form is valid", () => {
    (useLoginForm as jest.Mock).mockReturnValue({
      fullName: "John Doe",
      isOver18: true,
      isValid: true,
      isSubmitting: false,
      nameErrors: [],
      onSubmit: mockOnSubmit,
      handleNameChange: mockHandleNameChange,
      handleCheckboxChange: mockHandleCheckboxChange,
    });

    render(<LoginForm />);

    const button = screen.getByRole("button", { name: "Enter" });
    expect(button).not.toBeDisabled();
  });

  test("calls handleNameChange when input changes", () => {
    render(<LoginForm />);

    const input = screen.getByPlaceholderText("Your full name");
    fireEvent.change(input, { target: { value: "John Doe" } });

    expect(mockHandleNameChange).toHaveBeenCalledWith("John Doe");
  });

  test("calls handleCheckboxChange when checkbox is clicked", () => {
    render(<LoginForm />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockHandleCheckboxChange).toHaveBeenCalledWith(true);
  });

  test("displays error message when name has validation errors", () => {
    (useLoginForm as jest.Mock).mockReturnValue({
      fullName: "John",
      isOver18: false,
      isValid: false,
      isSubmitting: false,
      nameErrors: [
        { hasError: true, message: "Please enter your first and last name" },
      ],
      onSubmit: mockOnSubmit,
      handleNameChange: mockHandleNameChange,
      handleCheckboxChange: mockHandleCheckboxChange,
    });

    render(<LoginForm />);

    expect(
      screen.getByText("Please enter your first and last name")
    ).toBeInTheDocument();
  });

  test("submits form with correct data", () => {
    (useLoginForm as jest.Mock).mockReturnValue({
      fullName: "John Doe",
      isOver18: true,
      isValid: true,
      isSubmitting: false,
      nameErrors: [],
      onSubmit: mockOnSubmit,
      handleNameChange: mockHandleNameChange,
      handleCheckboxChange: mockHandleCheckboxChange,
    });

    render(<LoginForm />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test("disables button when form is submitting", () => {
    (useLoginForm as jest.Mock).mockReturnValue({
      fullName: "John Doe",
      isOver18: true,
      isValid: true,
      isSubmitting: true,
      nameErrors: [],
      onSubmit: mockOnSubmit,
      handleNameChange: mockHandleNameChange,
      handleCheckboxChange: mockHandleCheckboxChange,
    });

    render(<LoginForm />);

    const button = screen.getByRole("button", { name: "Enter" });
    expect(button).toBeDisabled();
  });

  test("renders button with correct type based on form validity", () => {
    (useLoginForm as jest.Mock).mockReturnValue({
      fullName: "John Doe",
      isOver18: true,
      isValid: true,
      isSubmitting: false,
      nameErrors: [],
      onSubmit: mockOnSubmit,
      handleNameChange: mockHandleNameChange,
      handleCheckboxChange: mockHandleCheckboxChange,
    });

    render(<LoginForm />);

    const button = screen.getByRole("button", { name: "Enter" });
    expect(button).toHaveAttribute("type", "submit");
  });
});
