"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/product.service";
import { CategoryCard } from "@/components/shared/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { PAGE_SIZE } from "@/utils/constants";

function CategoriesPageContent() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const categoriesQuery = useQuery({
        queryKey: ["categories", { page }],
        queryFn: () => getCategories({ page, limit: PAGE_SIZE })
    });

    const results = categoriesQuery.data?.results ?? 0;
    const totalPages = categoriesQuery.data?.metadata?.numberOfPages ?? Math.max(1, Math.ceil(results / PAGE_SIZE));

    return (
        <div className="container-responsive space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="section-title">Categories</h1>
                <p className="text-sm text-slate-500">Find products by category.</p>
            </div>

            {categoriesQuery.isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                        <Skeleton key={idx} className="h-32 rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categoriesQuery.data?.data.map((category) => (
                        <CategoryCard key={category._id} category={category} />
                    ))}
                </div>
            )}

            <Pagination currentPage={page} totalPages={totalPages} />
        </div>
    );
}

export default function CategoriesPage() {
    return (
        <Suspense
            fallback={
                <div className="container-responsive">
                    <p className="text-sm text-slate-600">Loading categories...</p>
                </div>
            }
        >
            <CategoriesPageContent />
        </Suspense>
    );
}
