"use client";
import React from "react";
import useFavoriteBrewerySection from "./hooks/useFavoriteBrewerySection";
import BreweryCard from "@/app/components/BreweryCard/BreweryCard";

const FavoriteBrewerySection = () => {
  const { favoriteBreweries, isFavorite } = useFavoriteBrewerySection();
  return (
    <>
      <div className="flex flex-col gap-6 w-full flex-1 p-6">
        <h1 className="font-semibold text-4xl">Your favorite breweries</h1>

        {!favoriteBreweries || favoriteBreweries?.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-lg">You don't have any favorite brewery :(</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteBreweries.map((brewery) => (
              <BreweryCard
                key={brewery.id}
                brewery={brewery}
                isFavorite={isFavorite(brewery.id)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="h-1 bg-black w-11/12 m-auto" />
    </>
  );
};

export default FavoriteBrewerySection;
