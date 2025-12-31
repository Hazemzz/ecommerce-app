"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/utils/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { clsx } from "clsx";
import { useMemo } from "react";

export function ProductCard({ product }: { product: Product }) {
    const { add: addToCart } = useCart();
    const { wishlist, add: addToWishlist, remove: removeFromWishlist } = useWishlist();

    const isInWishlist = useMemo(() => wishlist?.some((item) => item._id === product._id), [wishlist, product._id]);

    return (
        <div className="card-surface flex h-full flex-col overflow-hidden">
            <Link href={`/products/${product._id}`} className="relative block aspect-[4/5] w-full">
                <Image src={product.imageCover} alt={product.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
                {product.priceAfterDiscount ? <Badge className="absolute left-3 top-3">Sale</Badge> : null}
            </Link>
            <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span>{product.category?.name}</span>
                    <span className="inline-flex items-center gap-1">
                        ★ <span className="font-semibold text-slate-700">{product.ratingsAverage ?? "-"}</span>
                    </span>
                </div>
                <Link href={`/products/${product._id}`} className="line-clamp-2 text-sm font-semibold text-ink hover:text-primary-700">
                    {product.title}
                </Link>
                <div className="mt-auto flex items-center justify-between text-sm font-semibold text-ink">
                    <span>
                        {product.priceAfterDiscount ? (
                            <>
                                <span className="text-primary-700">${product.priceAfterDiscount}</span>
                                <span className="ml-2 text-xs text-slate-400 line-through">${product.price}</span>
                            </>
                        ) : (
                            `$${product.price}`
                        )}
                    </span>
                    <button
                        aria-label="Wishlist toggle"
                        className={clsx(
                            "rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-primary-200 hover:text-primary-600",
                            isInWishlist && "border-primary-200 bg-primary-50 text-primary-700"
                        )}
                        onClick={() => (isInWishlist ? removeFromWishlist(product._id) : addToWishlist(product._id))}
                    >
                        {isInWishlist ? "♥" : "♡"}
                    </button>
                </div>
                <Button onClick={() => addToCart(product._id)}>Add to Cart</Button>
            </div>
        </div>
    );
}
