import { useState, useCallback } from "react";
import { favoritesStorage } from "@/lib/storage";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>(() => favoritesStorage.get());

    const toggle = useCallback((id: string) => {
        const isNowFavorite = favoritesStorage.toggle(id);
        setFavorites(favoritesStorage.get());
        return isNowFavorite;
    }, []);

    const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

    return { favorites, toggle, isFavorite };
}
