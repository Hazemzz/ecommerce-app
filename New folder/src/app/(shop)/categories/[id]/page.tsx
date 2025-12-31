"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCategory, getProducts } from "@/services/product.service";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/shared/product-card";

export default function CategoryDetailPage() {
    const params = useParams();
    const categoryId = params?.id as string;

    const categoryQuery = useQuery({
        queryKey: ["category", categoryId],
        queryFn: () => getCategory(categoryId),
        enabled: Boolean(categoryId)
    });
    const productsQuery = useQuery({
        queryKey: ["products", { category: categoryId }],
        queryFn: () => getProducts({ category: categoryId, limit: 20 }),
        enabled: Boolean(categoryId)
    });

    if (categoryQuery.isLoading || !categoryQuery.data) {
        return (
            <div className="container-responsive space-y-4">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-20 w-full" />
            </div>
        );
    }

    return (
        <div className="container-responsive space-y-6">
            <div className="card-surface space-y-2 p-6">
                <p className="text-sm font-semibold text-primary-700">Category</p>
                <h1 className="text-3xl font-bold text-ink">{categoryQuery.data.name}</h1>
            </div>

            <div className="space-y-3">
                <h2 className="section-title">Products</h2>
                {productsQuery.isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, idx) => (
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
            </div>
        </div>
    );
}
