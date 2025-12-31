import { ReactNode } from "react";

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
    return (
        <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="section-title">{title}</h2>
            {action ? <div>{action}</div> : null}
        </div>
    );
}
