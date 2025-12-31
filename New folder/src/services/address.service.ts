import { apiClient } from "@/lib/api-client";
import { Address } from "@/utils/types";

export async function getAddresses() {
    const { data } = await apiClient.get<{ data: Address[] }>("/addresses");
    return data.data;
}

export async function createAddress(payload: Omit<Address, "_id">) {
    const { data } = await apiClient.post<{ data: Address[] }>("/addresses", payload);
    return data.data;
}

export async function deleteAddress(addressId: string) {
    const { data } = await apiClient.delete<{ data: Address[] }>(`/addresses/${addressId}`);
    return data.data;
}
