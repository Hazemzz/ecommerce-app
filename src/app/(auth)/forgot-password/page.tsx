"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

const emailSchema = z.object({ email: z.string().email() });
const codeSchema = z.object({ resetCode: z.string().min(4) });
const resetSchema = z
    .object({
        email: z.string().email(),
        newPassword: z.string().min(6)
    })
    .refine((v) => v.email.length > 0, { message: "Email is required", path: ["email"] });

type EmailValues = z.infer<typeof emailSchema>;
type CodeValues = z.infer<typeof codeSchema>;
type ResetValues = z.infer<typeof resetSchema>;

type Step = "email" | "code" | "reset";

export default function ForgotPasswordPage() {
    const { forgotPassword, verifyResetCode, resetPassword } = useAuth();
    const [step, setStep] = useState<Step>("email");
    const [emailValue, setEmailValue] = useState<string>("");

    const emailForm = useForm<EmailValues>({ resolver: zodResolver(emailSchema) });
    const codeForm = useForm<CodeValues>({ resolver: zodResolver(codeSchema) });
    const resetForm = useForm<ResetValues>({ resolver: zodResolver(resetSchema), defaultValues: { email: emailValue } });

    const submitEmail = async (values: EmailValues) => {
        try {
            await forgotPassword(values);
            setEmailValue(values.email);
            resetForm.setValue("email", values.email);
            toast.success("Reset code sent to your email");
            setStep("code");
        } catch (error: unknown) {
            const apiMessage =
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message;
            toast.error(apiMessage ?? (error instanceof Error ? error.message : "Failed to send code"));
        }
    };

    const submitCode = async (values: CodeValues) => {
        try {
            await verifyResetCode(values);
            toast.success("Code verified. Set a new password");
            setStep("reset");
        } catch (error: unknown) {
            const apiMessage =
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message;
            toast.error(apiMessage ?? (error instanceof Error ? error.message : "Invalid code"));
        }
    };

    const submitReset = async (values: ResetValues) => {
        try {
            await resetPassword(values);
            toast.success("Password updated. You can login now");
            setStep("email");
        } catch (error: unknown) {
            const apiMessage =
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message;
            toast.error(apiMessage ?? (error instanceof Error ? error.message : "Reset failed"));
        }
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-lg items-center justify-center px-4">
            <div className="card-surface w-full space-y-6 p-8">
                <div>
                    <h1 className="text-2xl font-semibold text-ink">Reset password</h1>
                    <p className="text-sm text-slate-500">We will guide you through the reset steps.</p>
                </div>

                {step === "email" ? (
                    <form className="space-y-4" onSubmit={emailForm.handleSubmit(submitEmail)}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-ink">Email</label>
                            <Input type="email" placeholder="you@example.com" {...emailForm.register("email")} />
                            {emailForm.formState.errors.email ? (
                                <p className="text-xs text-red-500">{emailForm.formState.errors.email.message}</p>
                            ) : null}
                        </div>
                        <Button type="submit" className="w-full" disabled={emailForm.formState.isSubmitting}>
                            {emailForm.formState.isSubmitting ? "Sending..." : "Send reset code"}
                        </Button>
                    </form>
                ) : null}

                {step === "code" ? (
                    <form className="space-y-4" onSubmit={codeForm.handleSubmit(submitCode)}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-ink">Reset code</label>
                            <Input placeholder="Enter the 6-digit code" {...codeForm.register("resetCode")} />
                            {codeForm.formState.errors.resetCode ? (
                                <p className="text-xs text-red-500">{codeForm.formState.errors.resetCode.message}</p>
                            ) : null}
                        </div>
                        <div className="flex gap-3">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("email")}>Back</Button>
                            <Button type="submit" className="flex-1" disabled={codeForm.formState.isSubmitting}>
                                {codeForm.formState.isSubmitting ? "Verifying..." : "Verify"}
                            </Button>
                        </div>
                    </form>
                ) : null}

                {step === "reset" ? (
                    <form className="space-y-4" onSubmit={resetForm.handleSubmit(submitReset)}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-ink">Email</label>
                            <Input type="email" disabled value={emailValue} {...resetForm.register("email")} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-ink">New password</label>
                            <Input type="password" placeholder="New password" {...resetForm.register("newPassword")} />
                            {resetForm.formState.errors.newPassword ? (
                                <p className="text-xs text-red-500">{resetForm.formState.errors.newPassword.message}</p>
                            ) : null}
                        </div>
                        <div className="flex gap-3">
                            <Button type="button" variant="outline" className="flex-1" onClick={() => setStep("code")}>Back</Button>
                            <Button type="submit" className="flex-1" disabled={resetForm.formState.isSubmitting}>
                                {resetForm.formState.isSubmitting ? "Updating..." : "Update password"}
                            </Button>
                        </div>
                    </form>
                ) : null}
            </div>
        </div>
    );
}
