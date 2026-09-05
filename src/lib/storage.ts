// localStorage helpers for favorites, compare, auth
const FAVORITES_KEY = "aqar_favorites";
const COMPARE_KEY = "aqar_compare";
const AUTH_KEY = "aqar_user";
const INQUIRIES_KEY = "aqar_inquiries";

export const favoritesStorage = {
    get: (): string[] => {
        try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]"); }
        catch { return []; }
    },
    add: (id: string) => {
        const favs = favoritesStorage.get();
        if (!favs.includes(id)) {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favs, id]));
        }
    },
    remove: (id: string) => {
        const favs = favoritesStorage.get().filter((f) => f !== id);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    },
    toggle: (id: string): boolean => {
        const favs = favoritesStorage.get();
        if (favs.includes(id)) {
            favoritesStorage.remove(id);
            return false;
        } else {
            favoritesStorage.add(id);
            return true;
        }
    },
    has: (id: string): boolean => favoritesStorage.get().includes(id),
};

export const compareStorage = {
    get: (): string[] => {
        try { return JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]"); }
        catch { return []; }
    },
    add: (id: string): boolean => {
        const items = compareStorage.get();
        if (items.length >= 4 || items.includes(id)) return false;
        localStorage.setItem(COMPARE_KEY, JSON.stringify([...items, id]));
        return true;
    },
    remove: (id: string) => {
        const items = compareStorage.get().filter((i) => i !== id);
        localStorage.setItem(COMPARE_KEY, JSON.stringify(items));
    },
    clear: () => localStorage.setItem(COMPARE_KEY, "[]"),
    has: (id: string): boolean => compareStorage.get().includes(id),
};

export const authStorage = {
    get: () => {
        try { return JSON.parse(localStorage.getItem(AUTH_KEY) || "null"); }
        catch { return null; }
    },
    set: (user: object) => localStorage.setItem(AUTH_KEY, JSON.stringify(user)),
    clear: () => localStorage.removeItem(AUTH_KEY),
};

export const inquiriesStorage = {
    get: () => {
        try { return JSON.parse(localStorage.getItem(INQUIRIES_KEY) || "[]"); }
        catch { return []; }
    },
    add: (inquiry: object) => {
        const list = inquiriesStorage.get();
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify([...list, inquiry]));
    },
};
