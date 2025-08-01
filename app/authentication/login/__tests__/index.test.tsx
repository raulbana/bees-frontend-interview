import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../page";
import LoginForm from "../components/LoginForm/LoginForm";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img src={props.src} alt={props.alt} data-testid="mock-image" />;
  },
}));

jest.mock("../components/LoginForm/LoginForm", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-login-form" />),
}));

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the login page", () => {
    render(<Login />);
    expect(screen.getByTestId("mock-login-form")).toBeInTheDocument();
    expect(screen.getByTestId("mock-image")).toBeInTheDocument();
  });

  test("renders the login form component", () => {
    render(<Login />);
    expect(LoginForm).toHaveBeenCalled();
  });

  test("renders bee illustration image", () => {
    render(<Login />);
    const image = screen.getByTestId("mock-image");
    expect(image).toHaveAttribute("alt", "bee illustration");
  });

  test("has correct container styles", () => {
    const { container } = render(<Login />);
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("flex");
    expect(mainContainer).toHaveClass("flex-col");
    expect(mainContainer).toHaveClass("w-screen");
    expect(mainContainer).toHaveClass("h-screen");
    expect(mainContainer).toHaveClass("bg-primary-yellow");
  });

  test("centers login form correctly", () => {
    render(<Login />);
    const formContainer = screen.getByTestId("mock-login-form").parentElement;
    expect(formContainer).toHaveClass("flex");
    expect(formContainer).toHaveClass("flex-col");
    expect(formContainer).toHaveClass("items-center");
    expect(formContainer).toHaveClass("justify-center");
    expect(formContainer).toHaveClass("flex-1");
  });
});
