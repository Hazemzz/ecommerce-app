"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    changePassword,
    forgotPassword,
    login as loginService,
    logout as logoutService,
    register as registerService,
    resetPassword,
    verifyResetCode
} from "@/services/auth.service";
import { storage, StoredUser } from "@/lib/storage";
import { LS_EVENT_LOGOUT } from "@/utils/constants";

export type AuthContextValue = {
    user: StoredUser | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (payload: { email: string; password: string }) => Promise<void>;
    register: (payload: {
        name: string;
        email: string;
        password: string;
        rePassword: string;
        phone: string;
    }) => Promise<void>;
    logout: () => void;
    changePassword: (payload: { currentPassword: string; password: string; rePassword: string }) => Promise<void>;
    forgotPassword: (payload: { email: string }) => Promise<void>;
    verifyResetCode: (payload: { resetCode: string }) => Promise<void>;
    resetPassword: (payload: { email: string; newPassword: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<StoredUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setUser(storage.getUser());
        setToken(storage.getToken());
        setLoading(false);

        const handleLogout = () => {
            setUser(null);
            setToken(null);
            router.push("/login");
        };

        const handleStorage = (event: StorageEvent) => {
            if (event.key === "ecommerce_token") {
                setToken(storage.getToken());
            }
            if (event.key === "ecommerce_user") {
                setUser(storage.getUser());
            }
        };

        window.addEventListener(LS_EVENT_LOGOUT, handleLogout);
        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener(LS_EVENT_LOGOUT, handleLogout);
            window.removeEventListener("storage", handleStorage);
        };
    }, [router]);

    const handleLogin = async (payload: { email: string; password: string }) => {
        setLoading(true);
        try {
            const res = await loginService(payload);
            setUser(res.user);
            setToken(res.token);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (payload: {
        name: string;
        email: string;
        password: string;
        rePassword: string;
        phone: string;
    }) => {
        setLoading(true);
        try {
            const res = await registerService(payload);
            setUser(res.user);
            setToken(res.token);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logoutService();
        setUser(null);
        setToken(null);
    };

    const ctx = useMemo<AuthContextValue>(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(token),
            loading,
            login: handleLogin,
            register: handleRegister,
            logout: handleLogout,
            changePassword: async (payload) => {
                await changePassword(payload);
            },
            forgotPassword: async (payload) => {
                await forgotPassword(payload);
            },
            verifyResetCode: async (payload) => {
                await verifyResetCode(payload);
            },
            resetPassword: async (payload) => {
                await resetPassword(payload);
            }
        }),
        [loading, token, user]
    );

    return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
