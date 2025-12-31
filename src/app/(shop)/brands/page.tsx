"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getBrands } from "@/services/product.service";
import { BrandCard } from "@/components/shared/brand-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { PAGE_SIZE } from "@/utils/constants";

function BrandsPageContent() {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;

    const brandsQuery = useQuery({ queryKey: ["brands", { page }], queryFn: () => getBrands({ page, limit: PAGE_SIZE }) });

    const results = brandsQuery.data?.results ?? 0;
    const totalPages = brandsQuery.data?.metadata?.numberOfPages ?? Math.max(1, Math.ceil(results / PAGE_SIZE));

    return (
        <div className="container-responsive space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="section-title">Brands</h1>
                <p className="text-sm text-slate-500">Explore brands you love.</p>
            </div>

            {brandsQuery.isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                        <Skeleton key={idx} className="h-32 rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {brandsQuery.data?.data.map((brand) => (
                        <BrandCard key={brand._id} brand={brand} />
                    ))}
                </div>
            )}

            <Pagination currentPage={page} totalPages={totalPages} />
        </div>
    );
}

export default function BrandsPage() {
    return (
        <Suspense
            fallback={
                <div className="container-responsive">
                    <p className="text-sm text-slate-600">Loading brands...</p>
                </div>
            }
        >
            <BrandsPageContent />
        </Suspense>
    );
}
