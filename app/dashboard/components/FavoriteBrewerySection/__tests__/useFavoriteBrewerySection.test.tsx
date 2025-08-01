import { renderHook } from "@testing-library/react";
import useFavoriteBrewerySection from "../hooks/useFavoriteBrewerySection";
import { useUserContext } from "@/app/store/userContext";
import { Brewery } from "@/app/types";

jest.mock("@/app/store/userContext", () => ({
  useUserContext: jest.fn(),
}));

describe("useFavoriteBrewerySection", () => {
  const mockBreweries: Brewery[] = [
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
      website_url: "https://example.com",
      state: "Test State",
      street: "123 Test St",
    },
    {
      id: "brewery-2",
      name: "Test Brewery 2",
      brewery_type: "brewpub",
      address_1: "456 Test St",
      city: "Test City",
      state_province: "Test State",
      postal_code: "54321",
      country: "Test Country",
      phone: "098-765-4321",
      website_url: "https://example2.com",
      state: "Test State",
      street: "456 Test St",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns favoriteBreweries from user context", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        favoriteBreweries: mockBreweries,
      },
    });

    const { result } = renderHook(() => useFavoriteBrewerySection());

    expect(result.current.favoriteBreweries).toEqual(mockBreweries);
  });

  test("returns undefined for favoriteBreweries when user is not defined", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: undefined,
    });

    const { result } = renderHook(() => useFavoriteBrewerySection());

    expect(result.current.favoriteBreweries).toBeUndefined();
  });

  test("isFavorite returns true when brewery is in favorites", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        favoriteBreweries: mockBreweries,
      },
    });

    const { result } = renderHook(() => useFavoriteBrewerySection());

    expect(result.current.isFavorite("brewery-1")).toBe(true);
  });

  test("isFavorite returns false when brewery is not in favorites", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        favoriteBreweries: mockBreweries,
      },
    });

    const { result } = renderHook(() => useFavoriteBrewerySection());

    expect(result.current.isFavorite("brewery-3")).toBe(false);
  });

  test("isFavorite returns false when user is not defined", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: undefined,
    });

    const { result } = renderHook(() => useFavoriteBrewerySection());

    expect(result.current.isFavorite("brewery-1")).toBe(false);
  });

  test("isFavorite returns false when favoriteBreweries is undefined", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        favoriteBreweries: undefined,
      },
    });

    const { result } = renderHook(() => useFavoriteBrewerySection());

    expect(result.current.isFavorite("brewery-1")).toBe(false);
  });

  test("isFavorite returns false when favoriteBreweries is null", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        favoriteBreweries: null,
      },
    });

    const { result } = renderHook(() => useFavoriteBrewerySection());

    expect(result.current.isFavorite("brewery-1")).toBe(false);
  });

  test("isFavorite returns false when favoriteBreweries is empty", () => {
    (useUserContext as jest.Mock).mockReturnValue({
      user: {
        favoriteBreweries: [],
      },
    });

    const { result } = renderHook(() => useFavoriteBrewerySection());

    expect(result.current.isFavorite("brewery-1")).toBe(false);
  });
});
