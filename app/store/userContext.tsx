"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User, Brewery } from "../types";

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (name: string, surname: string) => void;
  logout: () => void;
  addFavoriteBrewery: (brewery: Brewery) => void;
  removeFavoriteBrewery: (breweryId: string) => void;
  isBreweryFavorite: (breweryId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Failed to parse user data from localStorage:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user]);

  const login = useCallback((name: string, surname: string) => {
    const newUser: User = {
      name,
      surname,
      fullName: `${name} ${surname}`,
      favouriteBreweries: [],
    };

    setUser(newUser);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const addFavoriteBrewery = useCallback((brewery: Brewery) => {
    try {
      if (!user) {
        throw new Error("User is not logged in.");
      }

      const isAlreadyFavorite = user.favouriteBreweries.some(
        (favBrewery) => favBrewery.id === brewery.id
      );

      if (isAlreadyFavorite) {
        throw new Error("Brewery is already in favorites.");
      }

      setUser({
        ...user,
        favouriteBreweries: [...user.favouriteBreweries, brewery],
      });
    } catch (error) {
      throw new Error("Failed to add favorite brewery: " + error);
    }
  }, [user]);

  const removeFavoriteBrewery = useCallback((breweryId: string) => {
    if (!user) return;

    setUser({
      ...user,
      favouriteBreweries: user.favouriteBreweries.filter(
        (brewery) => brewery.id !== breweryId
      ),
    });
  }, [user]);

  const isBreweryFavorite = useCallback((breweryId: string): boolean => {
    if (!user) return false;

    return user.favouriteBreweries.some((brewery) => brewery.id === breweryId);
  }, [user]);

  const value = React.useMemo(
    () => ({
      user,
      isLoggedIn,
      login,
      logout,
      addFavoriteBrewery,
      removeFavoriteBrewery,
      isBreweryFavorite,
    }),
    [
      user,
      isLoggedIn,
      login,
      logout,
      addFavoriteBrewery,
      removeFavoriteBrewery,
      isBreweryFavorite,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }

  return context;
}