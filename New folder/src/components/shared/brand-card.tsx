import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/utils/types";

export function BrandCard({ brand }: { brand: Brand }) {
    return (
        <Link href={`/brands/${brand._id}`} className="card-surface flex flex-col items-center gap-3 p-4 text-center transition hover:-translate-y-1">
            {brand.image ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-100">
                    <Image src={brand.image} alt={brand.name} fill className="object-contain p-2" sizes="80px" />
                </div>
            ) : null}
            <span className="text-sm font-semibold text-ink">{brand.name}</span>
        </Link>
    );
}
