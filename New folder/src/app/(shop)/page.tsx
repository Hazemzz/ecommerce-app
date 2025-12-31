"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getBrands, getCategories, getProducts } from "@/services/product.service";
import { SectionHeader } from "@/components/shared/section-header";
import { ProductCard } from "@/components/shared/product-card";
import { BrandCard } from "@/components/shared/brand-card";
import { CategoryCard } from "@/components/shared/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    const productsQuery = useQuery({ queryKey: ["products", { limit: 8 }], queryFn: () => getProducts({ limit: 8 }) });
    const categoriesQuery = useQuery({ queryKey: ["categories", { limit: 6 }], queryFn: () => getCategories({ limit: 6 }) });
    const brandsQuery = useQuery({ queryKey: ["brands", { limit: 6 }], queryFn: () => getBrands({ limit: 6 }) });

    return (
        <div className="space-y-12">
            <section className="bg-gradient-to-r from-primary-50 via-white to-primary-50">
                <div className="container-responsive grid items-center gap-10 py-12 lg:grid-cols-2">
                    <div className="space-y-6">
                        <p className="inline-flex rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700">Route Exclusive</p>
                        <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">
                            Elevate your shopping with curated products and fast checkout.
                        </h1>
                        <p className="text-lg text-slate-600">
                            Browse thousands of products, manage your cart, wishlist favorites, and order with secure payments.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/products"><Button>Shop now</Button></Link>
                            <Link href="/brands"><Button variant="outline">Explore brands</Button></Link>
                        </div>
                    </div>
                    <div className="card-surface flex items-center justify-center bg-white/80 p-6">
                        <div className="grid w-full grid-cols-2 gap-3">
                            {productsQuery.data?.data.slice(0, 4).map((p) => (
                                <div key={p._id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-ink">
                                    <p className="line-clamp-2">{p.title}</p>
                                    <p className="text-primary-700">${p.price}</p>
                                </div>
                            )) || new Array(4).fill(null).map((_, idx) => <Skeleton key={idx} className="h-20 rounded-xl" />)}
                        </div>
                    </div>
                </div>
            </section>

            <section className="container-responsive">
                <SectionHeader title="Trending products" action={<Link href="/products" className="text-sm font-semibold text-primary-700">View all</Link>} />
                {productsQuery.isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 8 }).map((_, idx) => (
                            <Skeleton key={idx} className="h-72 rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {productsQuery.data?.data.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <section className="container-responsive">
                <SectionHeader title="Shop by category" action={<Link href="/categories" className="text-sm font-semibold text-primary-700">All categories</Link>} />
                {categoriesQuery.isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <Skeleton key={idx} className="h-32 rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categoriesQuery.data?.data.map((category) => (
                            <CategoryCard key={category._id} category={category} />
                        ))}
                    </div>
                )}
            </section>

            <section className="container-responsive">
                <SectionHeader title="Featured brands" action={<Link href="/brands" className="text-sm font-semibold text-primary-700">All brands</Link>} />
                {brandsQuery.isLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <Skeleton key={idx} className="h-32 rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {brandsQuery.data?.data.map((brand) => (
                            <BrandCard key={brand._id} brand={brand} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
