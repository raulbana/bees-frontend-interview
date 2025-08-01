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
  const [errorMessage, setErrorMessage] = useState("");

  const isFavorite = (breweryId: string) => {
    return user?.favoriteBreweries?.some((brewery) => brewery.id === breweryId);
  };

  const onSearch = async (query: string) => {
    try {
      if (!query.trim()) {
        setHasError(true);
        setErrorMessage("Search query cannot be empty.");
        setFoundBreweries([]);
        return;
      }

      setIsLoading(true);
      const response = await breweriesService.searchBreweries(query);
      if (response.length === 0) {
        setHasError(true);
        setErrorMessage("No breweries found for the search query.");
        setFoundBreweries([]);
        return;
      }
      setFoundBreweries(response);
    } catch (error) {
      console.error("Error searching breweries:", error);
      setHasError(true);
      setErrorMessage("An error occurred while searching for breweries.");
      setFoundBreweries([]);
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
    errorMessage,
    setErrorMessage,
  };
};

export default useSearchBrewerySection;
