import axios from "axios";
import { storage } from "@/lib/storage";
import { LS_EVENT_LOGOUT } from "@/utils/constants";

const apiClient = axios.create({
    baseURL: "https://ecommerce.routemisr.com/api/v1",
    headers: {
        "Content-Type": "application/json"
    }
});

apiClient.interceptors.request.use((config) => {
    const token = storage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.token = token;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
            storage.clearAll();
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event(LS_EVENT_LOGOUT));
            }
        }
        return Promise.reject(error);
    }
);

export { apiClient };
