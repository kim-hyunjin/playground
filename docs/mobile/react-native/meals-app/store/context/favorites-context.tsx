import { ReactNode, createContext, useCallback, useState } from 'react';

type FavoritesContextProp = {
  ids: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};
export const FavoritesContext = createContext<FavoritesContextProp>({
  ids: [],
  addFavorite: (id: string) => {},
  removeFavorite: (id: string) => {},
  isFavorite(id) {
    return false;
  },
});

function FavoritesContextProvider({ children }: { children: ReactNode }) {
  const [favoriteMealIds, setFavoriteMealIds] = useState<string[]>([]);

  const addFavorite = useCallback((id: string) => {
    setFavoriteMealIds((prev) => [...prev, id]);
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavoriteMealIds((prev) => prev.filter((mealId) => mealId !== id));
  }, []);

  const isFavorite = (id: string) => {
    return favoriteMealIds.includes(id);
  };

  return (
    <FavoritesContext.Provider
      value={{
        ids: favoriteMealIds,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export default FavoritesContextProvider;
