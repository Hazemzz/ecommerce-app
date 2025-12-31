import { apiClient } from "@/lib/api-client";
import { Address, Order } from "@/utils/types";

export async function createCashOrder(cartId: string, address: Address) {
    const { data } = await apiClient.post<Order | { data: Order }>(`/orders/${cartId}`, {
        shippingAddress: address
    });
    return (data as { data?: Order }).data ?? (data as Order);
}

export async function createCheckoutSession(cartId: string, address: Address, origin: string) {
    const { data } = await apiClient.post<{ session: { url: string } }>(
        `/orders/checkout-session/${cartId}`,
        {
            shippingAddress: address
        },
        {
            params: { url: origin }
        }
    );
    return data.session;
}

export async function getUserOrders(userId: string) {
    const { data } = await apiClient.get<Order[] | { data: Order[] }>(`/orders/user/${userId}`);
    return Array.isArray(data) ? data : data.data;
}
