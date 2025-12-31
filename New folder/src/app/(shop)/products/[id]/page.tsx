"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "@/services/product.service";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { ProductCard } from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailPage() {
    const params = useParams();
    const productId = params?.id as string;
    const { add: addToCart } = useCart();
    const { add: addToWishlist, wishlist, remove: removeFromWishlist } = useWishlist();

    const productQuery = useQuery({ queryKey: ["product", productId], queryFn: () => getProduct(productId), enabled: Boolean(productId) });
    const relatedQuery = useQuery({
        queryKey: ["related", productQuery.data?.category?._id],
        queryFn: () => getProducts({ category: productQuery.data?.category?._id, limit: 4 }),
        enabled: Boolean(productQuery.data?.category?._id)
    });

    const product = productQuery.data;
    const isInWishlist = wishlist?.some((item) => item._id === product?._id);

    if (productQuery.isLoading || !product) {
        return (
            <div className="container-responsive space-y-6">
                <Skeleton className="h-10 w-48" />
                <div className="grid gap-6 lg:grid-cols-2">
                    <Skeleton className="h-96 w-full" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-responsive space-y-10">
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="card-surface relative aspect-[4/5] overflow-hidden">
                    <Image src={product.imageCover} alt={product.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                </div>
                <div className="space-y-4">
                    <p className="text-sm font-semibold text-primary-700">{product.brand?.name}</p>
                    <h1 className="text-3xl font-bold text-ink">{product.title}</h1>
                    <p className="text-sm text-slate-600">{product.description}</p>
                    <div className="flex items-center gap-3 text-2xl font-semibold text-ink">
                        <span>${product.priceAfterDiscount ?? product.price}</span>
                        {product.priceAfterDiscount ? <span className="text-base text-slate-400 line-through">${product.price}</span> : null}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span>Category: {product.category?.name}</span>
                        <span>Rating: {product.ratingsAverage ?? "-"}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={() => addToCart(product._id)}>Add to cart</Button>
                        <Button
                            variant="outline"
                            onClick={() => (isInWishlist ? removeFromWishlist(product._id) : addToWishlist(product._id))}
                        >
                            {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="section-title">Related products</h2>
                {relatedQuery.isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, idx) => (
                            <Skeleton key={idx} className="h-72 rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {relatedQuery.data?.data.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
