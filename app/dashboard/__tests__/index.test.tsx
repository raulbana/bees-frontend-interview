import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "../page";
import Navbar from "@/app/components/Navbar/Navbar";
import FavoriteBrewerySection from "../components/FavoriteBrewerySection/FavoriteBrewerySection";
import SearchBrewerySection from "../components/SearchBrewerySection/SearchBrewerySection";

jest.mock("@/app/components/Navbar/Navbar", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-navbar" />),
}));

jest.mock(
  "../components/FavoriteBrewerySection/FavoriteBrewerySection",
  () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid="mock-favorite-brewery-section" />),
  })
);

jest.mock("../components/SearchBrewerySection/SearchBrewerySection", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mock-search-brewery-section" />),
}));

describe("Dashboard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders navbar component", () => {
    render(<Dashboard />);
    expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();
    expect(Navbar).toHaveBeenCalled();
  });

  test("renders favorite brewery section", () => {
    render(<Dashboard />);
    expect(
      screen.getByTestId("mock-favorite-brewery-section")
    ).toBeInTheDocument();
    expect(FavoriteBrewerySection).toHaveBeenCalled();
  });

  test("renders search brewery section", () => {
    render(<Dashboard />);
    expect(
      screen.getByTestId("mock-search-brewery-section")
    ).toBeInTheDocument();
    expect(SearchBrewerySection).toHaveBeenCalled();
  });

  test("renders divider between sections", () => {
    render(<Dashboard />);
    const divider = screen.getByRole("separator", { hidden: true });
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass("h-[1px]");
    expect(divider).toHaveClass("bg-black");
    expect(divider).toHaveClass("w-11/12");
  });

  test("renders with proper container styles", () => {
    const { container } = render(<Dashboard />);
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("bg-light-yellow");
    expect(mainContainer).toHaveClass("min-h-screen");
  });

  test("renders content with proper layout", () => {
    const { container } = render(<Dashboard />);
    const contentContainer = (container.firstChild as HTMLElement)
      .children[1] as HTMLElement;
    expect(contentContainer).toHaveClass("flex");
    expect(contentContainer).toHaveClass("flex-col");
    expect(contentContainer).toHaveClass("h-full");
    expect(contentContainer).toHaveClass("w-full");
  });
});
