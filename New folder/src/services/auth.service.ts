import { apiClient } from "@/lib/api-client";
import { storage, StoredUser } from "@/lib/storage";
import { LS_EVENT_LOGOUT } from "@/utils/constants";

export type AuthResponse = {
    message: string;
    token: string;
    user: StoredUser;
};

export async function login(payload: { email: string; password: string }) {
    const { data } = await apiClient.post<AuthResponse>("/auth/signin", payload);
    storage.setToken(data.token);
    storage.setUser(data.user);
    return data;
}

export async function register(payload: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    phone: string;
}) {
    const { data } = await apiClient.post<AuthResponse>("/auth/signup", payload);
    storage.setToken(data.token);
    storage.setUser(data.user);
    return data;
}

export async function forgotPassword(payload: { email: string }) {
    const { data } = await apiClient.post<{ statusMsg: string; message: string }>(
        "/auth/forgotPasswords",
        payload
    );
    return data;
}

export async function verifyResetCode(payload: { resetCode: string }) {
    const { data } = await apiClient.post<{ status: string }>("/auth/verifyResetCode", payload);
    return data;
}

export async function resetPassword(payload: { email: string; newPassword: string }) {
    const { data } = await apiClient.put<AuthResponse>("/auth/resetPassword", payload);
    storage.setToken(data.token);
    storage.setUser(data.user);
    return data;
}

export async function changePassword(payload: {
    currentPassword: string;
    password: string;
    rePassword: string;
}) {
    const { data } = await apiClient.put<AuthResponse>("/users/changeMyPassword", payload);
    storage.setToken(data.token);
    storage.setUser(data.user);
    return data;
}

export function logout() {
    storage.clearAll();
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(LS_EVENT_LOGOUT));
    }
}
