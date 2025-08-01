import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { BreweryContextProvider, useBreweryContext } from "../breweryContext";
import { breweriesService } from "@/app/services/breweryService";

jest.mock("@/app/services/breweryService", () => ({
  breweriesService: {
    searchBreweries: jest.fn(),
  },
}));

const mockBreweries = [
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
    website_url: "https://testbrewery1.com",
    state: "Test State",
    street: "123 Test St",
  },
  {
    id: "2",
    name: "Test Brewery 2",
    brewery_type: "brewpub",
    address_1: "456 Another St",
    city: "Another City",
    state_province: "Another State",
    postal_code: "54321",
    country: "Another Country",
    phone: "098-765-4321",
    website_url: "https://testbrewery2.com",
    state: "Another State",
    street: "456 Another St",
  },
];

const TestComponent = () => {
  const {
    searchQuery,
    searchResults,
    isLoading,
    error,
    setSearchQuery,
    searchBreweries,
    clearSearch,
  } = useBreweryContext();

  return (
    <div>
      <div data-testid="search-query">{searchQuery}</div>
      <div data-testid="search-results">{JSON.stringify(searchResults)}</div>
      <div data-testid="loading-state">
        {isLoading ? "Loading" : "Not Loading"}
      </div>
      <div data-testid="error-state">{error || "No Error"}</div>
      <button data-testid="set-query" onClick={() => setSearchQuery("test")}>
        Set Query
      </button>
      <button data-testid="search" onClick={() => searchBreweries("test")}>
        Search
      </button>
      <button data-testid="clear" onClick={clearSearch}>
        Clear
      </button>
    </div>
  );
};

const renderWithBreweryContext = (component: React.ReactNode) => {
  return render(<BreweryContextProvider>{component}</BreweryContextProvider>);
};

describe("BreweryContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("initializes with default values", () => {
    renderWithBreweryContext(<TestComponent />);

    expect(screen.getByTestId("search-query")).toHaveTextContent("");
    expect(screen.getByTestId("search-results")).toHaveTextContent("[]");
    expect(screen.getByTestId("loading-state")).toHaveTextContent(
      "Not Loading"
    );
    expect(screen.getByTestId("error-state")).toHaveTextContent("No Error");
  });

  test("updates search query when setSearchQuery is called", () => {
    renderWithBreweryContext(<TestComponent />);

    const setQueryButton = screen.getByTestId("set-query");
    act(() => {
      setQueryButton.click();
    });

    expect(screen.getByTestId("search-query")).toHaveTextContent("test");
  });

  test("calls searchBreweries and updates state when search button is clicked", async () => {
    (breweriesService.searchBreweries as jest.Mock).mockResolvedValue(
      mockBreweries
    );

    renderWithBreweryContext(<TestComponent />);

    const searchButton = screen.getByTestId("search");

    expect(screen.getByTestId("loading-state")).toHaveTextContent(
      "Not Loading"
    );

    act(() => {
      searchButton.click();
    });

    expect(breweriesService.searchBreweries).toHaveBeenCalledWith("test");

    await waitFor(() => {
      expect(screen.getByTestId("search-results")).toHaveTextContent(
        "Test Brewery 1"
      );
      expect(screen.getByTestId("loading-state")).toHaveTextContent(
        "Not Loading"
      );
    });
  });

  test("clears search state when clearSearch is called", async () => {
    (breweriesService.searchBreweries as jest.Mock).mockResolvedValue(
      mockBreweries
    );

    renderWithBreweryContext(<TestComponent />);

    const searchButton = screen.getByTestId("search");
    act(() => {
      searchButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("search-results")).toHaveTextContent(
        "Test Brewery 1"
      );
    });

    const clearButton = screen.getByTestId("clear");
    act(() => {
      clearButton.click();
    });

    expect(screen.getByTestId("search-query")).toHaveTextContent("");
    expect(screen.getByTestId("search-results")).toHaveTextContent("[]");
  });

  test("handles error when API call fails", async () => {
    const errorMessage = "Failed to search breweries. Please try again.";
    (breweriesService.searchBreweries as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    renderWithBreweryContext(<TestComponent />);

    const searchButton = screen.getByTestId("search");

    act(() => {
      searchButton.click();
    });

    await waitFor(() => {
      expect(screen.getByTestId("error-state")).toHaveTextContent(errorMessage);
    });
  });

  test("debounces search when searchQuery changes", async () => {
    jest.useFakeTimers();
    (breweriesService.searchBreweries as jest.Mock).mockResolvedValue(
      mockBreweries
    );

    renderWithBreweryContext(<TestComponent />);

    const setQueryButton = screen.getByTestId("set-query");

    act(() => {
      setQueryButton.click();
    });

    expect(breweriesService.searchBreweries).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(breweriesService.searchBreweries).toHaveBeenCalledWith("test");

    jest.useRealTimers();
  });
});
