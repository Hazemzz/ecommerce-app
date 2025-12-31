"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToWishlist, getWishlist, removeFromWishlist } from "@/services/wishlist.service";
import { Product } from "@/utils/types";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

const WishlistContext = createContext<{
    wishlist?: Product[];
    isLoading: boolean;
    add: (productId: string) => void;
    remove: (productId: string) => void;
}>({
    isLoading: false,
    add: () => undefined,
    remove: () => undefined
});

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const { data: wishlist, isLoading, refetch } = useQuery({
        queryKey: ["wishlist", token],
        queryFn: getWishlist,
        enabled: Boolean(token)
    });

    useEffect(() => {
        if (token) {
            refetch();
        }
    }, [refetch, token]);

    const addMutation = useMutation({
        mutationFn: addToWishlist,
        onSuccess: (data) => {
            queryClient.setQueryData(["wishlist", token], data);
            toast.success("Added to wishlist");
        }
    });

    const removeMutation = useMutation({
        mutationFn: removeFromWishlist,
        onSuccess: (data) => {
            queryClient.setQueryData(["wishlist", token], data);
            toast.success("Removed from wishlist");
        }
    });

    const value = useMemo(
        () => ({
            wishlist,
            isLoading,
            add: (productId: string) => addMutation.mutate(productId),
            remove: (productId: string) => removeMutation.mutate(productId)
        }),
        [addMutation, isLoading, removeMutation, token, wishlist]
    );

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
    return ctx;
}
