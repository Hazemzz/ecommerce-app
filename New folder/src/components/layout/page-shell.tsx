import { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export function PageShell({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 text-ink">
            <Navbar />
            <main className="pb-12 pt-6">{children}</main>
            <Footer />
        </div>
    );
}
