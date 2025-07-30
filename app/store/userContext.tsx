"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (name: string, surname: string) => {
    const newUser: User = {
      name,
      surname,
      fullName: `${name} ${surname}`,
      favouriteBreweries: [],
    };

    setUser(newUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  const addFavoriteBrewery = (brewery: Brewery) => {
    if (!user) return;

    setUser({
      ...user,
      favouriteBreweries: [...user.favouriteBreweries, brewery],
    });
  };

  const removeFavoriteBrewery = (breweryId: string) => {
    if (!user) return;

    setUser({
      ...user,
      favouriteBreweries: user.favouriteBreweries.filter(
        (brewery) => brewery.id !== breweryId
      ),
    });
  };

  const isBreweryFavorite = (breweryId: string): boolean => {
    if (!user) return false;

    return user.favouriteBreweries.some((brewery) => brewery.id === breweryId);
  };

  const value: UserContextType = React.useMemo(
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
