import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Dashboard from "@/app/dashboard/page";
import { UserContextProvider } from "@/app/store/userContext";
import { BreweryContextProvider } from "@/app/store/breweryContext";
import { breweriesService } from "@/app/services/breweryService";

jest.mock("@/app/services/breweryService", () => ({
  breweriesService: {
    searchBreweries: jest.fn(),
  },
}));

jest.mock("@/app/components/Navbar/Navbar", () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

const mockLocalStorage = () => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
};

describe("Dashboard Integration", () => {
  const mockBreweries = [
    {
      id: "brewery-1",
      name: "Test Brewery 1",
      brewery_type: "micro",
      address_1: "123 Test St",
      city: "Test City",
      state_province: "Test State",
      postal_code: "12345",
      country: "Test Country",
      phone: "123-456-7890",
      website_url: "https://test1.com",
      state: "Test State",
      street: "123 Test St",
    },
    {
      id: "brewery-2",
      name: "Test Brewery 2",
      brewery_type: "brewpub",
      address_1: "456 Test Ave",
      city: "Another City",
      state_province: "Another State",
      postal_code: "54321",
      country: "Another Country",
      phone: "987-654-3210",
      website_url: "https://test2.com",
      state: "Another State",
      street: "456 Test Ave",
    },
  ];

  let originalLocalStorage;
  let originalConsoleError;

  beforeEach(() => {
    originalLocalStorage = window.localStorage;
    originalConsoleError = console.error;
    console.error = jest.fn();

    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage(),
    });

    jest.clearAllMocks();
    (breweriesService.searchBreweries as jest.Mock).mockResolvedValue(
      mockBreweries
    );

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "John",
        surname: "Doe",
        fullName: "John Doe",
        favoriteBreweries: [],
      })
    );

    localStorage.setItem("session-expiry", (Date.now() + 3600000).toString());
  });

  afterEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: originalLocalStorage,
    });
    console.error = originalConsoleError;
  });

  test("search and add brewery to favorites", async () => {
    render(
      <UserContextProvider>
        <BreweryContextProvider>
          <Dashboard />
        </BreweryContextProvider>
      </UserContextProvider>
    );

    const favoritesHeading = screen.getByText("Your favorite breweries");
    const searchHeading = screen.getByText("Add a new brewery");

    expect(favoritesHeading).toBeInTheDocument();
    expect(searchHeading).toBeInTheDocument();
    expect(
      screen.getByText("You don't have any favorite brewery :(")
    ).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(
      "Find for your new favorite brewery"
    );
    const searchButton = screen.getByRole("button", { name: "Search" });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "test" } });
    });

    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(breweriesService.searchBreweries).toHaveBeenCalledWith("test");
      expect(screen.getByText("Test Brewery 1")).toBeInTheDocument();
      expect(screen.getByText("Test Brewery 2")).toBeInTheDocument();
    });

    const addButtons = screen.getAllByRole("button", {
      name: "Add to favorites",
    });

    await act(async () => {
      fireEvent.click(addButtons[0]);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("You don't have any favorite brewery :(")
      ).not.toBeInTheDocument();
    });

    const breweryCardsInFavorites = screen.getAllByText("Test Brewery 1");
    expect(breweryCardsInFavorites.length).toBe(2);

    const removeButtons = screen.getAllByRole("button", {
      name: "Remove from favorites",
    });

    await act(async () => {
      fireEvent.click(removeButtons[0]);
    });

    await waitFor(() => {
      expect(
        screen.getByText("You don't have any favorite brewery :(")
      ).toBeInTheDocument();
      expect(screen.getAllByText("Test Brewery 1").length).toBe(1);
    });
  });

  test("shows error message when search fails", async () => {
    (breweriesService.searchBreweries as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    render(
      <UserContextProvider>
        <BreweryContextProvider>
          <Dashboard />
        </BreweryContextProvider>
      </UserContextProvider>
    );

    const searchInput = screen.getByPlaceholderText(
      "Find for your new favorite brewery"
    );
    const searchButton = screen.getByRole("button", { name: "Search" });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "error" } });
    });

    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred while searching for breweries/i)
      ).toBeInTheDocument();
    });
  });

  test("shows empty results message when no breweries match search", async () => {
    (breweriesService.searchBreweries as jest.Mock).mockResolvedValue([]);

    render(
      <UserContextProvider>
        <BreweryContextProvider>
          <Dashboard />
        </BreweryContextProvider>
      </UserContextProvider>
    );

    const searchInput = screen.getByPlaceholderText(
      "Find for your new favorite brewery"
    );
    const searchButton = screen.getByRole("button", { name: "Search" });

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "nonexistent" } });
    });

    await act(async () => {
      fireEvent.click(searchButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText(/An error occurred while searching for breweries/i)
      ).toBeInTheDocument();
    });
  });
});
