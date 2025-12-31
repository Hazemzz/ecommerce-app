"use client";

import { createContext, ReactNode, useContext, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCart, clearCart, getCart, removeCartItem, updateCartItem } from "@/services/cart.service";
import { Cart } from "@/utils/types";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

const CartContext = createContext<{
    cart?: Cart;
    isLoading: boolean;
    add: (productId: string) => void;
    update: (productId: string, count: number) => void;
    remove: (productId: string) => void;
    clear: () => void;
}>({
    isLoading: false,
    add: () => undefined,
    update: () => undefined,
    remove: () => undefined,
    clear: () => undefined
});

export function CartProvider({ children }: { children: ReactNode }) {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const { data: cart, isLoading } = useQuery({
        queryKey: ["cart", token],
        queryFn: getCart,
        enabled: Boolean(token)
    });

    const addMutation = useMutation({
        mutationFn: addToCart,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["cart", token] });
            toast.success("Item added to cart");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ productId, count }: { productId: string; count: number }) => updateCartItem(productId, count),
        onSuccess: (data) => {
            queryClient.setQueryData(["cart", token], data);
        }
    });

    const removeMutation = useMutation({
        mutationFn: removeCartItem,
        onSuccess: (data) => {
            queryClient.setQueryData(["cart", token], data);
            toast.success("Item removed");
        }
    });

    const clearMutation = useMutation({
        mutationFn: clearCart,
        onSuccess: (data) => {
            queryClient.setQueryData(["cart", token], data);
        }
    });

    const value = useMemo(
        () => ({
            cart,
            isLoading,
            add: (productId: string) => addMutation.mutate(productId),
            update: (productId: string, count: number) => updateMutation.mutate({ productId, count }),
            remove: (productId: string) => removeMutation.mutate(productId),
            clear: () => clearMutation.mutate()
        }),
        [addMutation, cart, clearMutation, isLoading, removeMutation, updateMutation]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
}
