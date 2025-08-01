"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Brewery } from "../types";
import { breweriesService } from "../services/breweryService";

interface BreweryContextType {
  searchQuery: string;
  searchResults: Brewery[];
  isLoading: boolean;
  error: string | null;
  setSearchQuery: (query: string) => void;
  searchBreweries: (query: string) => Promise<void>;
  clearSearch: () => void;
}

const BreweryContext = createContext<BreweryContextType | undefined>(undefined);

export function BreweryContextProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Brewery[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchBreweries = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await breweriesService.searchBreweries(query);
      setSearchResults(results);
    } catch (err) {
      setError("Failed to search breweries. Please try again.");
      console.error("Error searching breweries:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const delayDebounceFn = setTimeout(() => {
        searchBreweries(searchQuery);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchBreweries]);

  const value = React.useMemo<BreweryContextType>(
    () => ({
      searchQuery,
      searchResults,
      isLoading,
      error,
      setSearchQuery,
      searchBreweries,
      clearSearch,
    }),
    [searchQuery, searchResults, isLoading, error, searchBreweries, clearSearch]
  );

  return (
    <BreweryContext.Provider value={value}>{children}</BreweryContext.Provider>
  );
}

export function useBreweryContext() {
  const context = useContext(BreweryContext);

  if (context === undefined) {
    throw new Error(
      "useBreweryContext must be used within a BreweryContextProvider"
    );
  }

  return context;
}
