import { apiClient } from "@/lib/api-client";
import { Product } from "@/utils/types";

export async function getWishlist() {
    const { data } = await apiClient.get<{ count: number; data: Product[] }>("/wishlist");
    return data.data;
}

export async function addToWishlist(productId: string) {
    const { data } = await apiClient.post<{ data: Product[] }>("/wishlist", { productId });
    return data.data;
}

export async function removeFromWishlist(productId: string) {
    const { data } = await apiClient.delete<{ data: Product[] }>(`/wishlist/${productId}`);
    return data.data;
}
