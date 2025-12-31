"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getUserOrders } from "@/services/order.service";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { PageShell } from "@/components/layout/page-shell";

export default function OrdersPage() {
    const { user, token, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) router.replace("/login");
    }, [isAuthenticated, router]);

    const ordersQuery = useQuery({
        queryKey: ["orders", user?._id, token],
        queryFn: () => getUserOrders(user!._id),
        enabled: Boolean(user?._id && token),
        refetchOnMount: "always",
        refetchOnWindowFocus: "always",
        staleTime: 0
    });

    useEffect(() => {
        if (token && user?._id) {
            ordersQuery.refetch();
        }
    }, [ordersQuery, token, user?._id]);

    if (!isAuthenticated) return null;

    if (ordersQuery.isError) {
        return (
            <PageShell>
                <div className="container-responsive">
                    <EmptyState title="Could not load orders" description="Please refresh or try again." />
                </div>
            </PageShell>
        );
    }

    const content = !ordersQuery.data || ordersQuery.data.length === 0 ? (
        <div className="container-responsive">
            <EmptyState title="No orders yet" description="Place your first order to see it here." />
        </div>
    ) : (
        <div className="container-responsive space-y-4">
            <h1 className="section-title">Orders</h1>
            <div className="space-y-4">
                {ordersQuery.data.map((order) => (
                    <div key={order._id} className="card-surface space-y-3 p-4">
                        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                            <span className="font-semibold text-ink">Order #{order._id.slice(-6)}</span>
                            <span>Placed {new Date(order.createdAt).toLocaleDateString()}</span>
                            <span>Payment: {order.paymentMethodType}</span>
                            <span className={order.isPaid ? "text-green-600" : "text-amber-600"}>{order.isPaid ? "Paid" : "Pending"}</span>
                            <span className={order.isDelivered ? "text-green-600" : "text-amber-600"}>
                                {order.isDelivered ? "Delivered" : "In transit"}
                            </span>
                        </div>
                        <div className="grid gap-2">
                            {order.cartItems.map((item) => (
                                <div key={item._id} className="flex items-center justify-between text-sm text-slate-700">
                                    <span className="line-clamp-1">{item.product.title}</span>
                                    <span>x{item.count}</span>
                                    <span className="font-semibold">${item.price}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between border-t border-slate-100 pt-3 text-sm font-semibold text-ink">
                            <span>Total</span>
                            <span>${order.totalOrderPrice}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <PageShell>
            {ordersQuery.isLoading ? (
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
