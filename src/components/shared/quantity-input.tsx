"use client";

import { Button } from "@/components/ui/button";

export function QuantityInput({ value, onChange }: { value: number; onChange: (value: number) => void }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1">
            <Button variant="ghost" onClick={() => onChange(Math.max(1, value - 1))} className="px-2 text-sm">
                -
            </Button>
            <span className="w-8 text-center text-sm font-medium">{value}</span>
            <Button variant="ghost" onClick={() => onChange(value + 1)} className="px-2 text-sm">
                +
            </Button>
        </div>
    );
}
