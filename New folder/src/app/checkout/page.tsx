"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useAddresses } from "@/hooks/use-addresses";
import { Address } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { createCashOrder, createCheckoutSession } from "@/services/order.service";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/page-shell";

const addressSchema = z.object({
    name: z.string().min(2),
    details: z.string().min(4),
    city: z.string().min(2),
    phone: z.string().min(6),
    postalCode: z.string().optional()
});

type AddressFormValues = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
    const { isAuthenticated, user, token } = useAuth();
    const { cart, isLoading: cartLoading } = useCart();
    const { addresses, createAddress } = useAddresses();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<AddressFormValues>({ resolver: zodResolver(addressSchema) });

    useEffect(() => {
        if (!isAuthenticated) router.replace("/login");
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (addresses && addresses.length > 0 && !selectedAddress) {
            setSelectedAddress(addresses[0]);
        }
    }, [addresses, selectedAddress]);

    const handleSaveAddress = async (values: AddressFormValues) => {
        await createAddress(values);
        reset();
    };

    const canCheckout = useMemo(() => cart && cart.products.length > 0 && selectedAddress, [cart, selectedAddress]);

    const payCash = async () => {
        if (!cart?._id || !selectedAddress) return;
        try {
            const order = await createCashOrder(cart._id, selectedAddress);
            // update caches so Orders page shows immediately
            queryClient.setQueryData(["orders", user?._id, token], (prev: unknown) => {
                const prevOrders = Array.isArray(prev) ? prev : [];
                return [order, ...prevOrders];
            });
            queryClient.invalidateQueries({ queryKey: ["orders", user?._id, token] });
            queryClient.invalidateQueries({ queryKey: ["cart", token] });
            toast.success("Order placed successfully");
            router.push("/orders");
        } catch (error: unknown) {
            const apiMessage =
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message;
            toast.error(apiMessage ?? (error instanceof Error ? error.message : "Cash order failed"));
        }
    };

    const payCard = async () => {
        if (!cart?._id || !selectedAddress) return;
        try {
            const session = await createCheckoutSession(cart._id, selectedAddress, window.location.origin);
            // Ensure orders/cart refresh after returning from checkout
            queryClient.invalidateQueries({ queryKey: ["orders", user?._id, token] });
            queryClient.invalidateQueries({ queryKey: ["cart", token] });
            window.location.href = session.url;
        } catch (error: unknown) {
            const apiMessage =
                typeof error === "object" &&
                error !== null &&
                "response" in error &&
                (error as { response?: { data?: { message?: string } } }).response?.data?.message;
            toast.error(apiMessage ?? (error instanceof Error ? error.message : "Payment init failed"));
        }
    };

    if (!isAuthenticated) return null;

    const content = !cart || cart.products.length === 0 ? (
        <div className="container-responsive">
            <EmptyState title="Cart is empty" description="Add items before checking out." />
        </div>
    ) : (
        <div className="container-responsive grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <div className="space-y-3">
                    <h1 className="section-title">Checkout</h1>
                    <p className="text-sm text-slate-600">Select an address or add a new one.</p>
                </div>

                <div className="card-surface space-y-4 p-4">
                    <h2 className="text-lg font-semibold text-ink">Addresses</h2>
                    <div className="space-y-3">
                        {addresses?.map((address) => (
                            <label key={address._id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:border-primary-300">
                                <input
                                    type="radio"
                                    name="address"
                                    className="mt-1"
                                    checked={selectedAddress?._id === address._id}
                                    onChange={() => setSelectedAddress(address)}
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-ink">{address.name}</p>
                                    <p className="text-sm text-slate-600">{address.details}</p>
                                    <p className="text-xs text-slate-500">{address.city} • {address.phone}</p>
                                </div>
                            </label>
                        ))}
                        {!addresses?.length ? <p className="text-sm text-slate-500">No saved addresses. Add one below.</p> : null}
                    </div>
                </div>

                <div className="card-surface space-y-4 p-4">
                    <h2 className="text-lg font-semibold text-ink">Add new address</h2>
                    <form className="grid grid-cols-1 gap-3 sm:grid-cols-2" onSubmit={handleSubmit(handleSaveAddress)}>
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
                        <div className="space-y-1 sm:col-span-2">
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
                        <div className="sm:col-span-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Save address"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="space-y-4">
                <div className="card-surface space-y-3 p-4">
                    <h2 className="text-lg font-semibold text-ink">Order summary</h2>
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Items</span>
                        <span>{cart.numOfCartItems}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold text-ink">
                        <span>Total</span>
                        <span>${cart.totalCartPrice}</span>
                    </div>
                    <Button className="w-full" onClick={payCash} disabled={!canCheckout}>
                        Pay cash on delivery
                    </Button>
                    <Button variant="outline" className="w-full" onClick={payCard} disabled={!canCheckout}>
                        Pay online
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <PageShell>
            {cartLoading ? (
                <div className="container-responsive">
                    <p className="text-sm text-slate-600">Loading checkout...</p>
                </div>
            ) : (
                content
            )}
        </PageShell>
    );
}
