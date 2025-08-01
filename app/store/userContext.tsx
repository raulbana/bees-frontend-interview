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

const STORAGE_KEYS = {
  USER: "user",
  AUTH_TOKEN: "auth-token",
  SESSION_EXPIRY: "session-expiry"
};

const SESSION_DURATION = 60 * 60 * 1000;

const setCookie = (name: string, value: string, expiryMs: number = SESSION_DURATION) => {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + expiryMs);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const removeCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

const saveUserToStorage = (user: User | null) => {
  if (typeof window === "undefined" || !user) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
};

const isSessionValid = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const expiryTime = localStorage.getItem(STORAGE_KEYS.SESSION_EXPIRY);
  if (!expiryTime) return false;
  
  return Date.now() < parseInt(expiryTime, 10);
};

export function UserContextProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    removeCookie(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (isSessionValid()) {
          const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser.favoriteBreweries) {
              parsedUser.favoriteBreweries = [];
            }
            setUser(parsedUser);
            setIsLoggedIn(true);
            setCookie(STORAGE_KEYS.AUTH_TOKEN, "true");
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.SESSION_EXPIRY);
      }
    }
  }, [logout]);

  const login = useCallback((name: string, surname: string) => {
    const newUser: User = {
      name,
      surname,
      fullName: `${name} ${surname}`,
      favoriteBreweries: [],
    };

    const expiryTime = Date.now() + SESSION_DURATION;
    localStorage.setItem(STORAGE_KEYS.SESSION_EXPIRY, expiryTime.toString());

    setUser(newUser);
    setIsLoggedIn(true);
    setCookie(STORAGE_KEYS.AUTH_TOKEN, "true");
    saveUserToStorage(newUser);
  }, []);

  const addFavoriteBrewery = useCallback(
    (brewery: Brewery) => {
      try {
        if (!user) {
          throw new Error("User is not logged in.");
        }

        if (!isSessionValid()) {
          logout();
          throw new Error("Session expired. Please login again.");
        }

        const isAlreadyFavorite = user.favoriteBreweries.some(
          (favBrewery) => favBrewery.id === brewery.id
        );

        if (isAlreadyFavorite) {
          throw new Error("Brewery is already in favorites.");
        }

        const updatedUser = {
          ...user,
          favoriteBreweries: [...(user.favoriteBreweries || []), brewery],
        };

        saveUserToStorage(updatedUser);
        
        setUser(updatedUser);
      } catch (error) {
        throw new Error("Failed to add favorite brewery: " + error);
      }
    },
    [user, logout]
  );

  const removeFavoriteBrewery = useCallback(
    (breweryId: string) => {
      if (!user) return;

      try {
        if (!isSessionValid()) {
          logout();
          return;
        }

        const updatedUser = {
          ...user,
          favoriteBreweries: (user.favoriteBreweries || []).filter(
            (brewery) => brewery.id !== breweryId
          ),
        };

        saveUserToStorage(updatedUser);
        
        setUser(updatedUser);
      } catch (error) {
        console.error("Error removing favorite brewery:", error);
      }
    },
    [user, logout]
  );

  const isBreweryFavorite = useCallback(
    (breweryId: string): boolean => {
      return user?.favoriteBreweries?.some((brewery) => brewery.id === breweryId) ?? false;
    },
    [user]
  );

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