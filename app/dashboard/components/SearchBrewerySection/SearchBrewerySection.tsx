"use client";
import React from "react";
import BreweryCard from "@/app/components/BreweryCard/BreweryCard";
import useSearchBrewerySection from "./hooks/useSearchBrewerySection";
import Input from "@/app/components/Input/Input";
import Button from "@/app/components/Button/Button";
import Loader from "@/app/components/Loader/Loader";
import Alert from "@/app/components/Alert/Alert";

const SearchBrewerySection = () => {
  const {
    foundBreweries,
    onSearch,
    setSearchQuery,
    searchQuery,
    isFavorite,
    isLoading,
    hasError,
    setHasError,
  } = useSearchBrewerySection();
  return (
    <div className="flex flex-col gap-6 w-full flex-1 p-6">
      {hasError && (
        <Alert
          type="ERROR"
          message="An error occurred while searching for breweries."
          show={hasError}
          onClose={() => setHasError(false)}
        />
      )}
      <div className="flex items-center justify-between w-full">
        <h1 className="font-semibold text-4xl">Your favorite breweries</h1>
        <div className="flex flex-col lg:flex-row items-center gap-2">
          <Input
            type="search"
            placeholder="Find for your new favorite brewery"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex w-24">
            <Button
              text="Search"
              size="SMALL"
              onClick={() => onSearch(searchQuery)}
            />
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-64">
          <Loader size="MEDIUM" color="PRIMARY" />
        </div>
      ) : (
        <>
          {!foundBreweries || foundBreweries?.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-lg">Search for a brewery to see the results</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foundBreweries.map((brewery) => (
                <BreweryCard
                  key={brewery.id}
                  brewery={brewery}
                  isFavorite={isFavorite(brewery.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchBrewerySection;
