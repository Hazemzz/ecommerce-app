import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
    return (
        <div className="card-surface flex flex-col items-center gap-3 px-6 py-10 text-center">
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            {description ? <p className="max-w-md text-sm text-slate-500">{description}</p> : null}
            {action ? action : <Link href="/products"><Button>Browse products</Button></Link>}
        </div>
    );
}
