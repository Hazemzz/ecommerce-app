"use client";

import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
    { className, ...props },
    ref
) {
    return (
        <input
            ref={ref}
            className={clsx(
                "block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink shadow-sm transition placeholder:text-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200",
                className
            )}
            {...props}
        />
    );
});
