import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBrewerySection from "../SearchBrewerySection";
import useSearchBrewerySection from "../hooks/useSearchBrewerySection";

jest.mock("../hooks/useSearchBrewerySection");
jest.mock("@/app/components/Input/Input", () => ({
  __esModule: true,
  default: function MockInput(props: any) {
    return <input data-testid="search-input" {...props} />;
  },
}));
jest.mock("@/app/components/Button/Button", () => ({
  __esModule: true,
  default: function MockButton(props: any) {
    return (
      <button data-testid="search-button" onClick={props.onClick}>
        {props.text}
      </button>
    );
  },
}));
jest.mock("@/app/components/Loader/Loader", () => ({
  __esModule: true,
  default: function MockLoader() {
    return <div data-testid="loader"></div>;
  },
}));
jest.mock("@/app/components/Alert/Alert", () => ({
  __esModule: true,
  default: function MockAlert(props: any) {
    return (
      <div
        data-testid="alert"
        data-type={props.type}
        data-show={props.show.toString()}
      >
        {props.message}
        <button
          data-testid="alert-close-button"
          onClick={() => props.onClose?.()}
        >
          Close
        </button>
      </div>
    );
  },
}));
jest.mock("@/app/components/BreweryCard/BreweryCard", () => ({
  __esModule: true,
  default: function MockBreweryCard(props: any) {
    return (
      <div
        data-testid="brewery-card"
        data-brewery-id={props.brewery.id}
        data-is-favorite={props.isFavorite?.toString()}
      >
        {props.brewery.name}
      </div>
    );
  },
}));

describe("SearchBrewerySection", () => {
  const mockFoundBreweries = [
    {
      id: "1",
      name: "Test Brewery 1",
      brewery_type: "micro",
      address_1: "123 Test St",
      city: "Test City",
      state_province: "Test State",
      postal_code: "12345",
      country: "Test Country",
      phone: "123-456-7890",
      website_url: "https://test.com",
      state: "Test State",
      street: "123 Test St",
    },
    {
      id: "2",
      name: "Test Brewery 2",
      brewery_type: "brewpub",
      address_1: "456 Test St",
      city: "Test City",
      state_province: "Test State",
      postal_code: "54321",
      country: "Test Country",
      phone: "098-765-4321",
      website_url: "https://test2.com",
      state: "Test State",
      street: "456 Test St",
    },
  ];

  const mockOnSearch = jest.fn();
  const mockSetSearchQuery = jest.fn();
  const mockSetHasError = jest.fn();
  const mockIsFavorite = jest.fn().mockImplementation((id) => id === "1");

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchBrewerySection as jest.Mock).mockReturnValue({
      foundBreweries: [],
      onSearch: mockOnSearch,
      setSearchQuery: mockSetSearchQuery,
      searchQuery: "",
      isFavorite: mockIsFavorite,
      isLoading: false,
      hasError: false,
      setHasError: mockSetHasError,
    });
  });

  test("renders section title correctly", () => {
    render(<SearchBrewerySection />);
    expect(screen.getByText("Add a new brewery")).toBeInTheDocument();
  });

  test("renders search input and button", () => {
    render(<SearchBrewerySection />);
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("search-button")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  test("calls setSearchQuery when input value changes", () => {
    render(<SearchBrewerySection />);
    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "test brewery" } });
    expect(mockSetSearchQuery).toHaveBeenCalled();
  });

  test("calls onSearch when search button is clicked", () => {
    (useSearchBrewerySection as jest.Mock).mockReturnValue({
      foundBreweries: [],
      onSearch: mockOnSearch,
      setSearchQuery: mockSetSearchQuery,
      searchQuery: "test brewery",
      isFavorite: mockIsFavorite,
      isLoading: false,
      hasError: false,
      setHasError: mockSetHasError,
    });

    render(<SearchBrewerySection />);
    const button = screen.getByTestId("search-button");
    fireEvent.click(button);
    expect(mockOnSearch).toHaveBeenCalledWith("test brewery");
  });

  test("displays loader when isLoading is true", () => {
    (useSearchBrewerySection as jest.Mock).mockReturnValue({
      foundBreweries: [],
      onSearch: mockOnSearch,
      setSearchQuery: mockSetSearchQuery,
      searchQuery: "",
      isFavorite: mockIsFavorite,
      isLoading: true,
      hasError: false,
      setHasError: mockSetHasError,
    });

    render(<SearchBrewerySection />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByTestId("brewery-card")).not.toBeInTheDocument();
  });

  test("displays error alert when hasError is true", () => {
    (useSearchBrewerySection as jest.Mock).mockReturnValue({
      foundBreweries: [],
      onSearch: mockOnSearch,
      setSearchQuery: mockSetSearchQuery,
      searchQuery: "",
      isFavorite: mockIsFavorite,
      isLoading: false,
      hasError: true,
      setHasError: mockSetHasError,
    });

    render(<SearchBrewerySection />);
    expect(screen.getByTestId("alert")).toBeInTheDocument();
    expect(screen.getByTestId("alert")).toHaveAttribute("data-type", "ERROR");
  });

  test("calls setHasError when closing the alert", () => {
    (useSearchBrewerySection as jest.Mock).mockReturnValue({
      foundBreweries: [],
      onSearch: mockOnSearch,
      setSearchQuery: mockSetSearchQuery,
      searchQuery: "",
      isFavorite: mockIsFavorite,
      isLoading: false,
      hasError: true,
      setHasError: mockSetHasError,
      setErrorMessage: jest.fn(),
    });

    render(<SearchBrewerySection />);
    const closeButton = screen.getByTestId("alert-close-button");
    fireEvent.click(closeButton);
    expect(mockSetHasError).toHaveBeenCalledWith(false);
  });

  test("displays empty state message when no breweries found", () => {
    (useSearchBrewerySection as jest.Mock).mockReturnValue({
      foundBreweries: [],
      onSearch: mockOnSearch,
      setSearchQuery: mockSetSearchQuery,
      searchQuery: "test",
      isFavorite: mockIsFavorite,
      isLoading: false,
      hasError: false,
      setHasError: mockSetHasError,
    });

    render(<SearchBrewerySection />);
    expect(
      screen.getByText("Search for a brewery to see the results")
    ).toBeInTheDocument();
  });

  test("renders brewery cards when breweries are found", () => {
    (useSearchBrewerySection as jest.Mock).mockReturnValue({
      foundBreweries: mockFoundBreweries,
      onSearch: mockOnSearch,
      setSearchQuery: mockSetSearchQuery,
      searchQuery: "test",
      isFavorite: mockIsFavorite,
      isLoading: false,
      hasError: false,
      setHasError: mockSetHasError,
    });

    render(<SearchBrewerySection />);

    expect(
      screen.queryByText("Search for a brewery to see the results")
    ).not.toBeInTheDocument();
    expect(screen.getAllByTestId("brewery-card")).toHaveLength(2);
    expect(screen.getByText("Test Brewery 1")).toBeInTheDocument();
    expect(screen.getByText("Test Brewery 2")).toBeInTheDocument();
  });

  test("passes isFavorite to brewery cards", () => {
    (useSearchBrewerySection as jest.Mock).mockReturnValue({
      foundBreweries: mockFoundBreweries,
      onSearch: mockOnSearch,
      setSearchQuery: mockSetSearchQuery,
      searchQuery: "test",
      isFavorite: mockIsFavorite,
      isLoading: false,
      hasError: false,
      setHasError: mockSetHasError,
    });

    render(<SearchBrewerySection />);

    const breweryCards = screen.getAllByTestId("brewery-card");
    expect(breweryCards[0]).toHaveAttribute("data-is-favorite", "true");
    expect(breweryCards[1]).toHaveAttribute("data-is-favorite", "false");
  });
});
