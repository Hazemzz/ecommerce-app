"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const schema = z
    .object({
        currentPassword: z.string().min(6),
        password: z.string().min(6),
        rePassword: z.string().min(6)
    })
    .refine((data) => data.password === data.rePassword, {
        path: ["rePassword"],
        message: "Passwords must match"
    });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordPage() {
    const { changePassword, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.replace("/login");
    }, [isAuthenticated, router]);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        try {
            await changePassword(values);
            toast.success("Password updated");
        } catch (error: unknown) {
            const apiMessage =
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message;
            toast.error(apiMessage ?? (error instanceof Error ? error.message : "Update failed"));
        }
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-4">
            <div className="card-surface w-full space-y-6 p-8">
                <div>
                    <h1 className="text-2xl font-semibold text-ink">Change password</h1>
                    <p className="text-sm text-slate-500">Keep your account secure.</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-ink">Current password</label>
                        <Input type="password" {...register("currentPassword")} />
                        {errors.currentPassword ? <p className="text-xs text-red-500">{errors.currentPassword.message}</p> : null}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-ink">New password</label>
                        <Input type="password" {...register("password")} />
                        {errors.password ? <p className="text-xs text-red-500">{errors.password.message}</p> : null}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-ink">Confirm password</label>
                        <Input type="password" {...register("rePassword")} />
                        {errors.rePassword ? <p className="text-xs text-red-500">{errors.rePassword.message}</p> : null}
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save changes"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
