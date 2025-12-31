import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();

    if (url.pathname.startsWith("/(auth)/")) {
        url.pathname = url.pathname.replace("/(auth)", "");
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/(auth)/:path*"]
};
