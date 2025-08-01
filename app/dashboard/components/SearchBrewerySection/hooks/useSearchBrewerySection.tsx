import { breweriesService } from "@/app/services/breweryService";
import { useUserContext } from "@/app/store/userContext";
import { Brewery } from "@/app/types";
import { useState } from "react";

const useSearchBrewerySection = () => {
  const { user } = useUserContext();
  const [foundBreweries, setFoundBreweries] = useState<Brewery[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const isFavorite = (breweryId: string) => {
    return user?.favoriteBreweries?.some((brewery) => brewery.id === breweryId);
  };

  const onSearch = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await breweriesService.searchBreweries(query);
      setFoundBreweries(response);
    } catch (error) {
      setFoundBreweries([]);
      console.error("Error searching breweries:", error);
      setHasError(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    foundBreweries,
    isLoading,
    setFoundBreweries,
    searchQuery,
    setSearchQuery,
    isFavorite,
    onSearch,
    hasError,
    setHasError,
  };
};

export default useSearchBrewerySection;
