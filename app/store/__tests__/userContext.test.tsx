import React from "react";
import { render, screen, act } from "@testing-library/react";
import { UserContextProvider, useUserContext } from "../userContext";

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

let cookies = "";
Object.defineProperty(document, "cookie", {
  get: jest.fn(() => cookies),
  set: jest.fn((value) => {
    cookies = value;
  }),
  configurable: true,
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const TestComponent = () => {
  const {
    user,
    isLoggedIn,
    login,
    logout,
    addFavoriteBrewery,
    removeFavoriteBrewery,
    isBreweryFavorite,
  } = useUserContext();

  return (
    <div>
      <div data-testid="user-info">
        {user ? JSON.stringify(user) : "No user"}
      </div>
      <div data-testid="login-status">
        {isLoggedIn ? "Logged In" : "Logged Out"}
      </div>
      <button data-testid="login-button" onClick={() => login("John", "Doe")}>
        Login
      </button>
      <button data-testid="logout-button" onClick={logout}>
        Logout
      </button>
      <button
        data-testid="add-favorite-button"
        onClick={() =>
          addFavoriteBrewery({
            id: "brewery-1",
            name: "Test Brewery",
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
          })
        }
      >
        Add Favorite
      </button>
      <button
        data-testid="remove-favorite-button"
        onClick={() => removeFavoriteBrewery("brewery-1")}
      >
        Remove Favorite
      </button>
      <div data-testid="is-favorite">
        {isBreweryFavorite("brewery-1") ? "Is Favorite" : "Not Favorite"}
      </div>
    </div>
  );
};

describe("UserContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
    cookies = "";

    jest.spyOn(Date, "now").mockReturnValue(1000);
  });

  test("initializes with default values", () => {
    render(
      <UserContextProvider>
        <TestComponent />
      </UserContextProvider>
    );

    expect(screen.getByTestId("user-info")).toHaveTextContent("No user");
    expect(screen.getByTestId("login-status")).toHaveTextContent("Logged Out");
    expect(screen.getByTestId("is-favorite")).toHaveTextContent("Not Favorite");
  });

  test("login updates user state and localStorage", () => {
    render(
      <UserContextProvider>
        <TestComponent />
      </UserContextProvider>
    );

    act(() => {
      screen.getByTestId("login-button").click();
    });

    expect(screen.getByTestId("user-info")).toHaveTextContent("John");
    expect(screen.getByTestId("login-status")).toHaveTextContent("Logged In");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "user",
      expect.stringContaining("John")
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "session-expiry",
      expect.any(String)
    );
  });

  test("logout clears user state and localStorage", () => {
    render(
      <UserContextProvider>
        <TestComponent />
      </UserContextProvider>
    );

    act(() => {
      screen.getByTestId("login-button").click();
    });

    expect(screen.getByTestId("login-status")).toHaveTextContent("Logged In");

    act(() => {
      screen.getByTestId("logout-button").click();
    });

    expect(screen.getByTestId("user-info")).toHaveTextContent("No user");
    expect(screen.getByTestId("login-status")).toHaveTextContent("Logged Out");
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user");
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("session-expiry");
  });

  test("adds brewery to favorites", async () => {
    render(
      <UserContextProvider>
        <TestComponent />
      </UserContextProvider>
    );

    act(() => {
      screen.getByTestId("login-button").click();
    });

    await act(async () => {
      screen.getByTestId("add-favorite-button").click();
    });

    expect(screen.getByTestId("user-info")).toHaveTextContent("Test Brewery");
    expect(screen.getByTestId("is-favorite")).toHaveTextContent("Is Favorite");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "user",
      expect.stringContaining("Test Brewery")
    );
  });

  test("removes brewery from favorites", async () => {
    render(
      <UserContextProvider>
        <TestComponent />
      </UserContextProvider>
    );

    act(() => {
      screen.getByTestId("login-button").click();
    });

    await act(async () => {
      screen.getByTestId("add-favorite-button").click();
    });

    expect(screen.getByTestId("is-favorite")).toHaveTextContent("Is Favorite");

    await act(async () => {
      screen.getByTestId("remove-favorite-button").click();
    });

    expect(screen.getByTestId("is-favorite")).toHaveTextContent("Not Favorite");
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "user",
      expect.not.stringContaining("Test Brewery")
    );
  });

  test("loads user from localStorage on initial render", () => {
    const storedUser = {
      name: "John",
      surname: "Doe",
      fullName: "John Doe",
      favoriteBreweries: [
        {
          id: "brewery-1",
          name: "Test Brewery",
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
      ],
    };

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user") return JSON.stringify(storedUser);
      if (key === "session-expiry") return (Date.now() + 3600000).toString();
      return null;
    });

    render(
      <UserContextProvider>
        <TestComponent />
      </UserContextProvider>
    );

    expect(screen.getByTestId("user-info")).toHaveTextContent("John");
    expect(screen.getByTestId("login-status")).toHaveTextContent("Logged In");
    expect(screen.getByTestId("is-favorite")).toHaveTextContent("Is Favorite");
  });

  test("does not load user when session is expired", () => {
    const storedUser = {
      name: "John",
      surname: "Doe",
      fullName: "John Doe",
      favoriteBreweries: [],
    };

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user") return JSON.stringify(storedUser);
      if (key === "session-expiry") return (Date.now() - 1000).toString();
      return null;
    });

    render(
      <UserContextProvider>
        <TestComponent />
      </UserContextProvider>
    );

    expect(screen.getByTestId("user-info")).toHaveTextContent("No user");
    expect(screen.getByTestId("login-status")).toHaveTextContent("Logged Out");
  });

  test("throws error when useUserContext is used outside provider", () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useUserContext must be used within a UserContextProvider");

    consoleSpy.mockRestore();
  });
});
