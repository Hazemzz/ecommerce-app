"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/brands", label: "Brands" },
    { href: "/categories", label: "Categories" },
    { href: "/orders", label: "Orders" }
];

export function Navbar() {
    const pathname = usePathname();
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <header className="border-b border-slate-100 bg-white">
            <div className="container-responsive flex items-center justify-between gap-6 py-4">
                <Link href="/" className="text-xl font-semibold text-primary-700">
                    Route Shop
                </Link>
                <nav className="hidden items-center gap-6 md:flex">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                "text-sm font-medium text-slate-600 hover:text-primary-700",
                                pathname === link.href && "text-primary-700"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center gap-3">
                    <Link href="/wishlist" className="relative text-sm font-medium text-slate-600 hover:text-primary-700">
                        Wishlist
                        {wishlist?.length ? (
                            <span className="absolute -right-3 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1 text-[11px] font-semibold text-white">
                                {wishlist.length}
                            </span>
                        ) : null}
                    </Link>
                    <Link href="/cart" className="relative text-sm font-medium text-slate-600 hover:text-primary-700">
                        Cart
                        {cart?.numOfCartItems ? (
                            <span className="absolute -right-3 -top-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1 text-[11px] font-semibold text-white">
                                {cart.numOfCartItems}
                            </span>
                        ) : null}
                    </Link>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <span className="hidden text-sm text-slate-600 sm:inline">Hi, {user?.name}</span>
                            <Button variant="outline" onClick={logout} className="text-sm">
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login" className="text-sm font-semibold text-primary-700">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
