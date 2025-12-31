const TOKEN_KEY = "ecommerce_token";
const USER_KEY = "ecommerce_user";

export type StoredUser = {
    _id: string;
    name: string;
    email: string;
    role?: string;
};

const isBrowser = typeof window !== "undefined";

export const storage = {
    getToken(): string | null {
        if (!isBrowser) return null;
        return window.localStorage.getItem(TOKEN_KEY);
    },
    setToken(token: string) {
        if (!isBrowser) return;
        window.localStorage.setItem(TOKEN_KEY, token);
    },
    clearToken() {
        if (!isBrowser) return;
        window.localStorage.removeItem(TOKEN_KEY);
    },
    getUser(): StoredUser | null {
        if (!isBrowser) return null;
        const raw = window.localStorage.getItem(USER_KEY);
        return raw ? (JSON.parse(raw) as StoredUser) : null;
    },
    setUser(user: StoredUser) {
        if (!isBrowser) return;
        window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clearUser() {
        if (!isBrowser) return;
        window.localStorage.removeItem(USER_KEY);
    },
    clearAll() {
        if (!isBrowser) return;
        this.clearToken();
        this.clearUser();
    }
};
