"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";
import { ProductCard } from "@/components/shared/product-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/layout/page-shell";

export default function WishlistPage() {
    const { wishlist, isLoading } = useWishlist();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.replace("/login");
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const content = !wishlist || wishlist.length === 0 ? (
        <div className="container-responsive">
            <EmptyState title="Wishlist is empty" description="Save products to your wishlist for later." />
        </div>
    ) : (
        <div className="container-responsive space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="section-title">Wishlist</h1>
                <Link href="/products" className="text-sm font-semibold text-primary-700">
                    Continue shopping
                </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {wishlist.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );

    return (
        <PageShell>
            {isLoading ? (
                <div className="container-responsive space-y-4">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-40 w-full" />
                </div>
            ) : (
                content
            )}
        </PageShell>
    );
}
