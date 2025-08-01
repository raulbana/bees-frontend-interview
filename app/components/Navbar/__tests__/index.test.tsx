import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";
import { useUserContext } from "@/app/store/userContext";
import { useRouter } from "next/navigation";

jest.mock("@/app/store/userContext", () => ({
  useUserContext: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("phosphor-react", () => ({
  ArrowCircleLeft: () => <div data-testid="arrow-icon" />,
}));

describe("Navbar Component", () => {
  const mockLogout = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserContext as jest.Mock).mockReturnValue({
      user: { name: "John", surname: "Doe" },
      logout: mockLogout,
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test("renders navbar with user name", () => {
    render(<Navbar />);
    expect(screen.getByText("Hi, John")).toBeInTheDocument();
  });

  test("renders logout button with correct text", () => {
    render(<Navbar />);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("renders arrow icon in logout button", () => {
    render(<Navbar />);
    expect(screen.getByTestId("arrow-icon")).toBeInTheDocument();
  });

  test("calls logout and redirects when logout button is clicked", () => {
    render(<Navbar />);
    const logoutButton = screen.getByText("Logout");

    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/authentication/login");
  });

  test("handles case when user name is undefined", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {},
      logout: mockLogout,
    });

    render(<Navbar />);
    expect(screen.getByText("Hi,")).toBeInTheDocument();
  });

  test("has correct styling for navbar", () => {
    const { container } = render(<Navbar />);
    const navbar = container.querySelector("nav");
    expect(navbar).toHaveClass("bg-primary-yellow");
    expect(navbar).toHaveClass("flex");
    expect(navbar).toHaveClass("items-center");
    expect(navbar).toHaveClass("justify-between");
  });

  test("has correct styling for logout button", () => {
    render(<Navbar />);
    const logoutButton = screen.getByText("Logout").closest("button");
    expect(logoutButton).toHaveClass("flex");
    expect(logoutButton).toHaveClass("items-center");
    expect(logoutButton).toHaveClass("gap-2");
    expect(logoutButton).toHaveClass("cursor-pointer");
  });
});
