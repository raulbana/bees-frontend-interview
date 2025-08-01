import { renderHook, act } from "@testing-library/react";
import useSearchBrewerySection from "../hooks/useSearchBrewerySection";
import { breweriesService } from "@/app/services/breweryService";
import { useUserContext } from "@/app/store/userContext";
import { Brewery } from "@/app/types";

jest.mock("@/app/services/breweryService", () => ({
  breweriesService: {
    searchBreweries: jest.fn(),
  },
}));

jest.mock("@/app/store/userContext", () => ({
  useUserContext: jest.fn(),
}));

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe("useSearchBrewerySection", () => {
  const mockUser = {
    name: "John",
    surname: "Doe",
    fullName: "John Doe",
    favoriteBreweries: [
      {
        id: "brewery-1",
        name: "Favorite Brewery",
        brewery_type: "micro",
        address_1: "123 Main St",
        city: "Example City",
        state_province: "Example State",
        postal_code: "12345",
        country: "Example Country",
        phone: "123-456-7890",
        website_url: "https://example.com",
        state: "Example State",
        street: "123 Main St",
      },
    ],
  };

  const mockBreweries: Brewery[] = [
    {
      id: "brewery-1",
      name: "Favorite Brewery",
      brewery_type: "micro",
      address_1: "123 Main St",
      city: "Example City",
      state_province: "Example State",
      postal_code: "12345",
      country: "Example Country",
      phone: "123-456-7890",
      website_url: "https://example.com",
      state: "Example State",
      street: "123 Main St",
    },
    {
      id: "brewery-2",
      name: "Test Brewery",
      brewery_type: "brewpub",
      address_1: "456 Elm St",
      city: "Another City",
      state_province: "Another State",
      postal_code: "54321",
      country: "Another Country",
      phone: "987-654-3210",
      website_url: "https://test.com",
      state: "Another State",
      street: "456 Elm St",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useUserContext as jest.Mock).mockReturnValue({ user: mockUser });
    (breweriesService.searchBreweries as jest.Mock).mockResolvedValue(
      mockBreweries
    );
  });

  test("initializes with default values", () => {
    const { result } = renderHook(() => useSearchBrewerySection());

    expect(result.current.foundBreweries).toEqual([]);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasError).toBe(false);
  });

  test("isFavorite returns true for favorite brewery", () => {
    const { result } = renderHook(() => useSearchBrewerySection());

    expect(result.current.isFavorite("brewery-1")).toBe(true);
  });

  test("isFavorite returns false for non-favorite brewery", () => {
    const { result } = renderHook(() => useSearchBrewerySection());

    expect(result.current.isFavorite("brewery-2")).toBe(false);
  });

  test("onSearch sets error and empty results for empty query", async () => {
    const { result } = renderHook(() => useSearchBrewerySection());

    await act(async () => {
      await result.current.onSearch("");
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.foundBreweries).toEqual([]);
    expect(breweriesService.searchBreweries).not.toHaveBeenCalled();
  });

  test("onSearch sets error when API returns empty results", async () => {
    (breweriesService.searchBreweries as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useSearchBrewerySection());

    await act(async () => {
      await result.current.onSearch("nonexistent");
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.foundBreweries).toEqual([]);
  });

  test("onSearch sets error and clears results on API error", async () => {
    (breweriesService.searchBreweries as jest.Mock).mockRejectedValue(
      new Error("API Error")
    );

    const { result } = renderHook(() => useSearchBrewerySection());

    await act(async () => {
      await result.current.onSearch("test");
    });

    expect(result.current.hasError).toBe(true);
    expect(result.current.foundBreweries).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  test("setSearchQuery updates searchQuery state", () => {
    const { result } = renderHook(() => useSearchBrewerySection());

    act(() => {
      result.current.setSearchQuery("new query");
    });

    expect(result.current.searchQuery).toBe("new query");
  });

  test("setHasError updates hasError state", () => {
    const { result } = renderHook(() => useSearchBrewerySection());

    act(() => {
      result.current.setHasError(true);
    });

    expect(result.current.hasError).toBe(true);

    act(() => {
      result.current.setHasError(false);
    });

    expect(result.current.hasError).toBe(false);
  });
});