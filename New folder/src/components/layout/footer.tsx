import Link from "next/link";

const currentYear = new Date().getFullYear();

const quickLinks = [
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/brands", label: "Brands" },
    { href: "/orders", label: "Orders" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/cart", label: "Cart" }
];

const helpLinks = [
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/returns", label: "Returns" },
    { href: "/shipping", label: "Shipping" }
];

export function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-white text-sm text-slate-600">
            <div className="container-responsive grid gap-8 py-10 md:grid-cols-4">
                <div className="space-y-3">
                    <h2 className="text-base font-semibold text-ink">Route Shop</h2>
                    <p className="text-slate-500">
                        Your one-stop shop for authentic products, fast shipping, and secure checkout powered by Route APIs.
                    </p>
                    <div className="flex gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">Secure checkout</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">24/7 support</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-ink">Shop</h3>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                        {quickLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="hover:text-ink">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-ink">Help</h3>
                    <div className="grid grid-cols-2 gap-2 text-slate-600">
                        {helpLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="hover:text-ink">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="text-xs text-slate-500">
                        <p>Support: support@route.shop</p>
                        <p>Phone: +20 111 222 333</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-ink">Stay in the loop</h3>
                    <p className="text-slate-500">Get the latest deals and releases. No spam, ever.</p>
                    <form className="flex flex-col gap-2 sm:flex-row">
                        <input
                            type="email"
                            name="newsletter"
                            placeholder="Enter your email"
                            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500"
                        />
                        <button
                            type="submit"
                            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                        >
                            Subscribe
                        </button>
                    </form>
                    <div className="text-xs text-slate-500">
                        <p>We accept major cards and offer cash on delivery.</p>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50">
                <div className="container-responsive flex flex-col gap-2 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <span>© {currentYear} Route Shop. All rights reserved.</span>
                    <span>Built with Next.js, React Query, and Tailwind CSS.</span>
                </div>
            </div>
        </footer>
    );
}
