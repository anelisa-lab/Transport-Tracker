import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const ROUTES_KEY = "@smart_transport/fav_routes";
const STOPS_KEY = "@smart_transport/fav_stops";

interface FavouritesContextValue {
  favRoutes: string[];
  favStops: string[];
  toggleFavRoute: (id: string) => void;
  toggleFavStop: (id: string) => void;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favRoutes, setFavRoutes] = useState<string[]>([]);
  const [favStops, setFavStops] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(ROUTES_KEY),
      AsyncStorage.getItem(STOPS_KEY),
    ]).then(([r, s]) => {
      if (r) setFavRoutes(JSON.parse(r));
      if (s) setFavStops(JSON.parse(s));
    });
  }, []);

  const toggleFavRoute = useCallback((id: string) => {
    setFavRoutes((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      AsyncStorage.setItem(ROUTES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleFavStop = useCallback((id: string) => {
    setFavStops((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      AsyncStorage.setItem(STOPS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <FavouritesContext.Provider
      value={{ favRoutes, favStops, toggleFavRoute, toggleFavStop }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites(): FavouritesContextValue {
  const ctx = useContext(FavouritesContext);
  if (!ctx)
    throw new Error("useFavourites must be used inside FavouritesProvider");
  return ctx;
}
