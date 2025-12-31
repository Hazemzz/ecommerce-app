"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Address } from "@/utils/types";
import { createAddress, deleteAddress, getAddresses } from "@/services/address.service";
import { toast } from "sonner";

export function useAddresses() {
    const queryClient = useQueryClient();

    const { data: addresses, isLoading } = useQuery({
        queryKey: ["addresses"],
        queryFn: getAddresses
    });

    const createMutation = useMutation({
        mutationFn: createAddress,
        onSuccess: (data) => {
            queryClient.setQueryData(["addresses"], data);
            toast.success("Address saved");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAddress,
        onSuccess: (data) => {
            queryClient.setQueryData(["addresses"], data);
            toast.success("Address removed");
        }
    });

    return {
        addresses,
        isLoading,
        createAddress: (payload: Omit<Address, "_id">) => createMutation.mutateAsync(payload),
        deleteAddress: (addressId: string) => deleteMutation.mutateAsync(addressId)
    };
}
