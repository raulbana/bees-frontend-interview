import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from "../Checkbox";
import * as useCheckboxModule from "../hooks/useCheckbox";

jest.mock("../hooks/useCheckbox", () => ({
  useCheckbox: jest.fn(),
}));

describe("Checkbox Component", () => {
  const mockHandleChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useCheckboxModule.useCheckbox as jest.Mock).mockReturnValue({
      handleChange: mockHandleChange,
    });
  });

  test("renders with default label", () => {
    render(<Checkbox checked={false} onChange={() => {}} />);
    expect(
      screen.getByText("Are you older than 18 years old?")
    ).toBeInTheDocument();
  });

  test("renders with custom label", () => {
    render(
      <Checkbox checked={false} onChange={() => {}} label="Custom label" />
    );
    expect(screen.getByText("Custom label")).toBeInTheDocument();
  });

  test("renders without label when label is empty", () => {
    render(<Checkbox checked={false} onChange={() => {}} label="" />);
    expect(
      screen.queryByText("Are you older than 18 years old?")
    ).not.toBeInTheDocument();
  });

  test("renders checkbox in unchecked state", () => {
    render(<Checkbox checked={false} onChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  test("renders checkbox in checked state", () => {
    render(<Checkbox checked={true} onChange={() => {}} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("calls handleChange when checkbox is clicked", () => {
    const onChangeMock = jest.fn();
    render(<Checkbox checked={false} onChange={onChangeMock} />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockHandleChange).toHaveBeenCalledTimes(1);
  });

  test("applies extra classes when provided", () => {
    const { container } = render(
      <Checkbox checked={false} onChange={() => {}} extraClasses="test-class" />
    );
    const wrapperDiv = container.firstChild as HTMLElement;
    expect(wrapperDiv).toHaveClass("test-class");
  });

  test("passes additional props to input element", () => {
    render(
      <Checkbox
        checked={false}
        onChange={() => {}}
        id="test-id"
        data-testid="test"
      />
    );
    const checkbox = screen.getByTestId("test");
    expect(checkbox).toHaveAttribute("id", "test-id");
  });

  test("svg icon is visible when checkbox is checked", () => {
    const { container } = render(
      <Checkbox checked={true} onChange={() => {}} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("opacity-100");
    expect(svg).not.toHaveClass("opacity-0");
  });

  test("svg icon is hidden when checkbox is unchecked", () => {
    const { container } = render(
      <Checkbox checked={false} onChange={() => {}} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("opacity-0");
    expect(svg).not.toHaveClass("opacity-100");
  });

  test("passes onChange to useCheckbox hook", () => {
    const onChangeMock = jest.fn();
    render(<Checkbox checked={false} onChange={onChangeMock} />);

    expect(useCheckboxModule.useCheckbox).toHaveBeenCalledWith({
      onChange: onChangeMock,
    });
  });
});
