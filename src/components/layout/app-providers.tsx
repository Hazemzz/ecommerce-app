"use client";

import { ReactNode, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/query-client";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { WishlistProvider } from "@/context/wishlist-context";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => getQueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        {children}
                        <Toaster richColors position="top-right" />
                        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
