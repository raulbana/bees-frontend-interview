import { useUserContext } from "@/app/store/userContext";

const useFavoriteBrewerySection = () => {
  const { user } = useUserContext();

  const isFavorite = (breweryId: string): boolean => {
    return (
      user?.favoriteBreweries.some((brewery) => brewery.id === breweryId) ??
      false
    );
  };
  return { favoriteBreweries: user?.favoriteBreweries, isFavorite };
};

export default useFavoriteBrewerySection;