import { Brewery } from "@/app/types";
import React from "react";
import { useUserContext } from "@/app/store/userContext";
import { Phone, PlusCircle, Trash, MapPin, ChartBar } from "phosphor-react";

interface BreweryCardProps {
  brewery: Brewery;
  isFavorite?: boolean;
}

const BreweryCard: React.FC<BreweryCardProps> = ({
  brewery,
  isFavorite = false,
}) => {
  const { addFavoriteBrewery, removeFavoriteBrewery } = useUserContext();

  const handleAddFavorite = () => {
    addFavoriteBrewery(brewery);
  };

  const handleRemoveFavorite = () => {
    removeFavoriteBrewery(brewery.id);
  };

  return (
    <div className="bg-white px-4 py-6 gap-4 rounded border border-black flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-2">
        <h2 className="font-semibold text-lg">{brewery.name}</h2>
        {isFavorite ? (
          <button
            onClick={handleRemoveFavorite}
            aria-label="Remove from favorites"
            className="cursor-pointer"
          >
            <Trash weight="fill" size={24} color="#3F3F46" />
          </button>
        ) : (
          <button
            onClick={handleAddFavorite}
            aria-label="Add to favorites"
            className="cursor-pointer"
          >
            <PlusCircle size={24} color="#1D1B20" />
          </button>
        )}
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>{brewery.street}</p>
        <p>
          {brewery.city}, {brewery.state} - {brewery.country}
        </p>
      </div>

      <div className="flex gap-3 mt-3">
        {brewery.brewery_type && (
          <div className="bg-primary-yellow px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <ChartBar size={16} color="#3F3F46" />
            <span>{brewery.brewery_type.toUpperCase()}</span>
          </div>
        )}

        {brewery.postal_code && (
          <div className="bg-primary-yellow px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <MapPin size={16} color="#3F3F46" />
            <span>{brewery.postal_code}</span>
          </div>
        )}

        {brewery.phone && (
          <div className="bg-primary-yellow px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Phone size={16} color="#3F3F46" />
            <span className="text-xs ml-1">{brewery.phone}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreweryCard;
