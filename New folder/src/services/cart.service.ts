import { apiClient } from "@/lib/api-client";
import { Cart } from "@/utils/types";

export async function getCart() {
    const { data } = await apiClient.get<{ data: Cart }>("/cart");
    return data.data;
}

export async function addToCart(productId: string) {
    const { data } = await apiClient.post<{ data: Cart }>("/cart", { productId });
    return data.data;
}

export async function removeCartItem(productId: string) {
    const { data } = await apiClient.delete<{ data: Cart }>(`/cart/${productId}`);
    return data.data;
}

export async function updateCartItem(productId: string, count: number) {
    const { data } = await apiClient.put<{ data: Cart }>(`/cart/${productId}`, { count });
    return data.data;
}

export async function clearCart() {
    const { data } = await apiClient.delete<{ data: Cart }>("/cart");
    return data.data;
}
