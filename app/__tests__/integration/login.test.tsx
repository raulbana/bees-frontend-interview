import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Login from "@/app/authentication/login/page";
import { UserContextProvider } from "@/app/store/userContext";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => (
    <img {...props} alt="mock-image" data-testid="mock-image" />
  ),
}));

describe("Login Flow Integration", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  test("complete login flow with valid inputs", async () => {
    render(
      <UserContextProvider>
        <Login />
      </UserContextProvider>
    );

    const nameInput = screen.getByPlaceholderText("Your full name");
    const checkbox = screen.getByRole("checkbox");
    const submitButton = screen.getByRole("button", { name: "Enter" });

    expect(submitButton).toBeDisabled();

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.click(checkbox);
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("validation prevents login with invalid name", async () => {
    render(
      <UserContextProvider>
        <Login />
      </UserContextProvider>
    );

    const nameInput = screen.getByPlaceholderText("Your full name");
    const checkbox = screen.getByRole("checkbox");

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "John" } });
      fireEvent.click(checkbox);
    });

    await waitFor(() => {
      const errorElement = screen.getByText(/first and last name/i);
      expect(errorElement).toBeInTheDocument();
    });
  });
});