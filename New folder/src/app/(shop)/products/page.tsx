"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/product.service";
import { ProductCard } from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { PAGE_SIZE } from "@/utils/constants";

function ProductsPageContent() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const productsQuery = useQuery({
        queryKey: ["products", { page }],
        queryFn: () => getProducts({ page, limit: PAGE_SIZE })
    });

    const results = productsQuery.data?.results ?? 0;
    const totalPages = productsQuery.data?.metadata?.numberOfPages ?? Math.max(1, Math.ceil(results / PAGE_SIZE));

    return (
        <div className="container-responsive space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="section-title">Products</h1>
                <p className="text-sm text-slate-500">Browse our catalog with pagination and wishlisting.</p>
            </div>

            {productsQuery.isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                        <Skeleton key={idx} className="h-72 rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {productsQuery.data?.data.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}

            <Pagination currentPage={page} totalPages={totalPages} />
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense
            fallback={
                <div className="container-responsive">
                    <p className="text-sm text-slate-600">Loading products...</p>
                </div>
            }
        >
            <ProductsPageContent />
        </Suspense>
    );
}
