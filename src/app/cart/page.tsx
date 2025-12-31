"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { QuantityInput } from "@/components/shared/quantity-input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { PageShell } from "@/components/layout/page-shell";

export default function CartPage() {
    const { cart, isLoading, update, remove } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    const content = !cart || cart.products.length === 0 ? (
        <div className="container-responsive">
            <EmptyState title="Your cart is empty" description="Add products to your cart to start checkout." />
        </div>
    ) : (
        <div className="container-responsive grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
                <h1 className="section-title">Cart</h1>
                <div className="card-surface divide-y divide-slate-100">
                    {cart.products.map((item) => (
                        <div key={item._id} className="flex gap-4 p-4">
                            <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-slate-100">
                                <Image src={item.product.imageCover} alt={item.product.title} fill className="object-cover" sizes="100px" />
                            </div>
                            <div className="flex flex-1 flex-col gap-2">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-sm font-semibold text-ink">{item.product.title}</h3>
                                        <p className="text-xs text-slate-500">{item.product.category?.name}</p>
                                    </div>
                                    <button className="text-sm text-red-500" onClick={() => remove(item.product._id)}>
                                        Remove
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <QuantityInput value={item.count} onChange={(value) => update(item.product._id, value)} />
                                    <span className="text-sm font-semibold text-ink">${item.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="card-surface space-y-3 p-4">
                    <h2 className="text-lg font-semibold text-ink">Order summary</h2>
                    <div className="flex justify-between text-sm text-slate-600">
                        <span>Items</span>
                        <span>{cart.numOfCartItems}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-ink">
                        <span>Total</span>
                        <span>${cart.totalCartPrice}</span>
                    </div>
                    <Link href="/checkout">
                        <Button className="w-full">Proceed to checkout</Button>
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <PageShell>
            {isLoading ? (
                <div className="container-responsive space-y-4">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-40 w-full" />
                </div>
            ) : (
                content
            )}
        </PageShell>
    );
}
