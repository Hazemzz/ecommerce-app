"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
const variants = {
    solid: "bg-primary-600 text-white hover:bg-primary-700 focus-visible:outline-primary-600",
    ghost: "bg-transparent text-primary-700 hover:bg-primary-50 focus-visible:outline-primary-600",
    outline: "border border-slate-200 text-ink hover:bg-slate-50 focus-visible:outline-primary-600"
};

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }>(
    function Button({ className, variant = "solid", ...props }, ref) {
        return <button ref={ref} className={clsx(base, variants[variant], className)} {...props} />;
    }
);
