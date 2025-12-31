import { clsx } from "clsx";
import { ReactNode } from "react";

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
    return <span className={clsx("inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700", className)}>{children}</span>;
}
