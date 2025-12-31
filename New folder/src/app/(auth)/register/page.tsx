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

const schema = z
    .object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().min(6),
        password: z.string().min(6),
        rePassword: z.string().min(6)
    })
    .refine((data) => data.password === data.rePassword, {
        message: "Passwords must match",
        path: ["rePassword"]
    });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
    const router = useRouter();
    const { register: registerUser, isAuthenticated } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        try {
            await registerUser(values);
            toast.success("Account created");
            router.push("/");
        } catch (error: unknown) {
            const apiMessage =
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message;
            toast.error(apiMessage ?? (error instanceof Error ? error.message : "Registration failed"));
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
                    <h1 className="text-2xl font-semibold text-ink">Create account</h1>
                    <p className="text-sm text-slate-500">Shop faster with your Route Shop profile.</p>
                </div>
                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-ink">Full name</label>
                        <Input placeholder="Jane Doe" {...register("name")} />
                        {errors.name ? <p className="text-xs text-red-500">{errors.name.message}</p> : null}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-ink">Email</label>
                        <Input type="email" placeholder="you@example.com" {...register("email")} />
                        {errors.email ? <p className="text-xs text-red-500">{errors.email.message}</p> : null}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-ink">Phone</label>
                        <Input placeholder="0100 000 0000" {...register("phone")} />
                        {errors.phone ? <p className="text-xs text-red-500">{errors.phone.message}</p> : null}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-ink">Password</label>
                        <Input type="password" placeholder="••••••" {...register("password")} />
                        {errors.password ? <p className="text-xs text-red-500">{errors.password.message}</p> : null}
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-ink">Confirm password</label>
                        <Input type="password" placeholder="••••••" {...register("rePassword")} />
                        {errors.rePassword ? <p className="text-xs text-red-500">{errors.rePassword.message}</p> : null}
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </Button>
                </form>
                <div className="text-sm text-slate-600">
                    Already registered? <Link href="/login" className="text-primary-700">Login</Link>
                </div>
            </div>
        </div>
    );
}
