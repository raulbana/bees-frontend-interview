import { useUserContext } from "@/app/store/userContext";

const useFavoriteBrewerySection = () => {
  const { user } = useUserContext();

  const isFavorite = (breweryId: string): boolean => {
    if (!user || !user.favoriteBreweries) {
      return false;
    }

    return user.favoriteBreweries.some((brewery) => brewery.id === breweryId);
  };

  return { favoriteBreweries: user?.favoriteBreweries, isFavorite };
};

export default useFavoriteBrewerySection;
