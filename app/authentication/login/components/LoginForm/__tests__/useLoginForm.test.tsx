import React from "react";
import { renderHook, act } from "@testing-library/react";
import useLoginForm from "../hooks/useLoginForm";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/store/userContext";
import { useForm } from "react-hook-form";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/store/userContext", () => ({
  useUserContext: jest.fn(),
}));

jest.mock("react-hook-form", () => ({
  useForm: jest.fn(),
}));

describe("useLoginForm Hook", () => {
  const mockRouter = { push: jest.fn() };
  const mockLogin = jest.fn();
  const mockSetValue = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockWatch = jest.fn();
  const mockFormState = { errors: {}, isValid: false };

  beforeEach(() => {
    jest.clearAllMocks();
    mockHandleSubmit.mockImplementation(
      (callback) =>
        (data = {}) =>
          callback(data)
    );
    mockWatch.mockImplementation((name) => {
      if (name === "fullName") return "";
      if (name === "isOver18") return false;
      return "";
    });

    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useUserContext as jest.Mock).mockReturnValue({ login: mockLogin });
    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: mockHandleSubmit,
      formState: mockFormState,
      watch: mockWatch,
      setValue: mockSetValue,
    });
  });

  test("initializes with default values", () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.fullName).toBe("");
    expect(result.current.isOver18).toBe(false);
    expect(result.current.isValid).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.nameErrors).toEqual([]);
  });

  test("handleNameChange updates fullName value", () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleNameChange("John Doe");
    });

    expect(mockSetValue).toHaveBeenCalledWith("fullName", "John Doe", {
      shouldValidate: true,
    });
  });

  test("handleCheckboxChange updates isOver18 value", () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => {
      result.current.handleCheckboxChange(true);
    });

    expect(mockSetValue).toHaveBeenCalledWith("isOver18", true, {
      shouldValidate: true,
    });
  });

  test("onSubmit processes valid form data correctly", async () => {
    mockHandleSubmit.mockImplementation(
      (callback) => () => callback({ fullName: "John Doe", isOver18: true })
    );

    const { result } = renderHook(() => useLoginForm());

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(mockLogin).toHaveBeenCalledWith("John", "Doe");
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  test("getNameErrors returns errors when present", () => {
    mockFormState.errors = { fullName: { message: "Test error" } };

    const { result } = renderHook(() => useLoginForm());

    const errors = result.current.nameErrors;
    expect(errors).toEqual([{ hasError: true, message: "Test error" }]);
  });

  test("getNameErrors returns empty array when no errors", () => {
    mockFormState.errors = {};

    const { result } = renderHook(() => useLoginForm());

    const errors = result.current.nameErrors;
    expect(errors).toEqual([]);
  });
});
