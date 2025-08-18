import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/server/auth";

const AUTH_PATHS = new Set<string>(["/auth/signin", "/auth/error", "/auth/verify-request"]);
const PROTECTED_PATHS = new Set<string>(["/", "/dashboard", "/notification", "/notification/:path*"]);

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (AUTH_PATHS.has(pathname)) {
        const session = await auth();
        if (session) {
            const origin = new URL("/", req.nextUrl.origin);
            return NextResponse.redirect(origin);
        }
        return NextResponse.next();
    }

    if (PROTECTED_PATHS.has(pathname)) {
        const session = await auth();

        if (!session) {
            const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
            signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
            return NextResponse.redirect(signInUrl);
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"],
};
