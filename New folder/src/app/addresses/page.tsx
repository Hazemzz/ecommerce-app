"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth-context";
import { useAddresses } from "@/hooks/use-addresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/layout/page-shell";

const schema = z.object({
    name: z.string().min(2),
    details: z.string().min(4),
    city: z.string().min(2),
    phone: z.string().min(6),
    postalCode: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export default function AddressesPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { addresses, isLoading, createAddress, deleteAddress } = useAddresses();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    useEffect(() => {
        if (!isAuthenticated) router.replace("/login");
    }, [isAuthenticated, router]);

    const onSubmit = async (values: FormValues) => {
        await createAddress(values);
        reset();
    };

    if (!isAuthenticated) return null;

    return (
        <PageShell>
            <div className="container-responsive grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    <h1 className="section-title">Addresses</h1>
                    <div className="card-surface divide-y divide-slate-100">
                        {isLoading ? (
                            <Skeleton className="h-32 w-full" />
                        ) : addresses && addresses.length > 0 ? (
                            addresses.map((address) => (
                                <div key={address._id} className="flex items-center justify-between gap-3 p-4">
                                    <div>
                                        <p className="text-sm font-semibold text-ink">{address.name}</p>
                                        <p className="text-sm text-slate-600">{address.details}</p>
                                        <p className="text-xs text-slate-500">{address.city} • {address.phone}</p>
                                    </div>
                                    <Button variant="outline" onClick={() => deleteAddress(address._id)}>
                                        Delete
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-sm text-slate-500">No addresses saved.</p>
                        )}
                    </div>
                </div>

                <div className="card-surface space-y-4 p-4">
                    <h2 className="text-lg font-semibold text-ink">Add new address</h2>
                    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-ink">Name</label>
                            <Input {...register("name")} />
                            {errors.name ? <p className="text-xs text-red-500">{errors.name.message}</p> : null}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-ink">City</label>
                            <Input {...register("city")} />
                            {errors.city ? <p className="text-xs text-red-500">{errors.city.message}</p> : null}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-ink">Details</label>
                            <Input {...register("details")} />
                            {errors.details ? <p className="text-xs text-red-500">{errors.details.message}</p> : null}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-ink">Phone</label>
                            <Input {...register("phone")} />
                            {errors.phone ? <p className="text-xs text-red-500">{errors.phone.message}</p> : null}
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-ink">Postal code</label>
                            <Input {...register("postalCode")} />
                            {errors.postalCode ? <p className="text-xs text-red-500">{errors.postalCode.message}</p> : null}
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save address"}
                        </Button>
                    </form>
                </div>
            </div>
        </PageShell>
    );
}
