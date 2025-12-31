"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        try {
            await login(values);
            toast.success("Welcome back!");
            router.push("/");
        } catch (error: unknown) {
            const apiMessage =
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message;
            toast.error(apiMessage ?? (error instanceof Error ? error.message : "Login failed"));
        }
    };

    if (isAuthenticated) {
        router.replace("/");
        return null;
    }

    return (
        <div className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-4">
            <div className="card-surface w-full space-y-6 p-8">
                <div>
                    <h1 className="text-2xl font-semibold text-ink">Login</h1>
                    <p className="text-sm text-slate-500">Access your Route Shop account.</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-ink">Email</label>
                        <Input type="email" placeholder="you@example.com" {...register("email")} />
                        {errors.email ? <p className="text-xs text-red-500">{errors.email.message}</p> : null}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-ink">Password</label>
                        <Input type="password" placeholder="••••••" {...register("password")} />
                        {errors.password ? <p className="text-xs text-red-500">{errors.password.message}</p> : null}
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in..." : "Login"}
                    </Button>
                </form>
                <div className="flex flex-col gap-2 text-sm text-slate-600">
                    <Link href="/forgot-password" className="text-primary-700">Forgot password?</Link>
                    <span>
                        Don&apos;t have an account? <Link href="/register" className="text-primary-700">Create one</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}
