"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="mt-6 flex items-center justify-center gap-3">
            <Button variant="outline" disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
                Previous
            </Button>
            <span className="text-sm font-medium text-slate-600">
                Page {currentPage} of {totalPages}
            </span>
            <Button variant="outline" disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}>
                Next
            </Button>
        </div>
    );
}
