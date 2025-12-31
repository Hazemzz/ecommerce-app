import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "@/app/globals.css";
import { AppProviders } from "@/components/layout/app-providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
    title: "Route Shop | E-Commerce",
    description: "Production-ready e-commerce experience built with Next.js and Route APIs"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
            <body>
                <AppProviders>{children}</AppProviders>
            </body>
        </html>
    );
}
