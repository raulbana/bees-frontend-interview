import React from "react";
import { render, screen } from "@testing-library/react";
import FavoriteBrewerySection from "../FavoriteBrewerySection";
import useFavoriteBrewerySection from "../hooks/useFavoriteBrewerySection";
import { Brewery } from "@/app/types";

jest.mock("../hooks/useFavoriteBrewerySection");
jest.mock("@/app/components/BreweryCard/BreweryCard", () => {
  return function MockBreweryCard(props: any) {
    return (
      <div
        data-testid="brewery-card"
        data-brewery-id={props.brewery.id}
        data-is-favorite={props.isFavorite.toString()}
      >
        {props.brewery.name}
      </div>
    );
  };
});

describe("FavoriteBrewerySection", () => {
  const mockFavoriteBreweries: Brewery[] = [
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

  const mockIsFavorite = jest
    .fn()
    .mockImplementation((id: string) =>
      mockFavoriteBreweries.some((brewery) => brewery.id === id)
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders heading correctly", () => {
    (useFavoriteBrewerySection as jest.Mock).mockReturnValue({
      favoriteBreweries: [],
      isFavorite: mockIsFavorite,
    });

    render(<FavoriteBrewerySection />);
    expect(screen.getByText("Your favorite breweries")).toBeInTheDocument();
  });

  test("renders empty state message when no favorites exist", () => {
    (useFavoriteBrewerySection as jest.Mock).mockReturnValue({
      favoriteBreweries: [],
      isFavorite: mockIsFavorite,
    });

    render(<FavoriteBrewerySection />);
    expect(
      screen.getByText("You don't have any favorite brewery :(")
    ).toBeInTheDocument();
  });

  test("renders empty state when favoriteBreweries is undefined", () => {
    (useFavoriteBrewerySection as jest.Mock).mockReturnValue({
      favoriteBreweries: undefined,
      isFavorite: mockIsFavorite,
    });

    render(<FavoriteBrewerySection />);
    expect(
      screen.getByText("You don't have any favorite brewery :(")
    ).toBeInTheDocument();
  });

  test("renders brewery cards when favorites exist", () => {
    (useFavoriteBrewerySection as jest.Mock).mockReturnValue({
      favoriteBreweries: mockFavoriteBreweries,
      isFavorite: mockIsFavorite,
    });

    render(<FavoriteBrewerySection />);

    expect(
      screen.queryByText("You don't have any favorite brewery :(")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Test Brewery 1")).toBeInTheDocument();
    expect(screen.getByText("Test Brewery 2")).toBeInTheDocument();

    const breweryCards = screen.getAllByTestId("brewery-card");
    expect(breweryCards).toHaveLength(2);
  });

  test("passes correct props to BreweryCard components", () => {
    (useFavoriteBrewerySection as jest.Mock).mockReturnValue({
      favoriteBreweries: mockFavoriteBreweries,
      isFavorite: mockIsFavorite,
    });

    render(<FavoriteBrewerySection />);

    const breweryCards = screen.getAllByTestId("brewery-card");

    expect(breweryCards[0]).toHaveAttribute("data-brewery-id", "1");
    expect(breweryCards[0]).toHaveAttribute("data-is-favorite", "true");

    expect(breweryCards[1]).toHaveAttribute("data-brewery-id", "2");
    expect(breweryCards[1]).toHaveAttribute("data-is-favorite", "true");

    expect(mockIsFavorite).toHaveBeenCalledWith("1");
    expect(mockIsFavorite).toHaveBeenCalledWith("2");
  });
});
