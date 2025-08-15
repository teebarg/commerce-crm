import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/server/auth";

const AUTH_PATHS = new Set<string>(["/auth/signin", "/auth/error", "/auth/verify-request"]);
const PROTECTED_PATHS = new Set<string>(["/", "/dashboard"]);

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    console.log(":rocket: ~ file: middleware.ts:10 ~ pathname:", pathname)

    // Skip public/auth routes and common static assets
    // if (
    //     pathname.startsWith("/_next") ||
    //     pathname.startsWith("/api") ||
    //     pathname.startsWith("/favicon") ||
    //     pathname.startsWith("/site.webmanifest") ||
    //     pathname.startsWith("/android-chrome") ||
    //     pathname.startsWith("/apple-touch-icon") ||
    //     PUBLIC_PATHS.has(pathname)
    // ) {
    //     return NextResponse.next();
    // }

    // const session = await auth();
    // console.log("🚀 ~ file: middleware.ts:26 ~ session:", session)

    // try {
    //     const session = await auth();
    //     console.log("🚀 ~ file: middleware.ts:26 ~ session:", session)
    // } catch (error) {
    //     console.log("🚀 ~ file: middleware.ts:28 ~ error:", error)
    // }

    // if (!session) {
    //     const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
    //     signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    //     return NextResponse.redirect(signInUrl);
    // }

    // if (PUBLIC_PATHS.has(pathname)) {
    //     return NextResponse.next();
    // }

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
        console.log("🚀 ~ file: middleware.ts:26 ~ session:", session)

        if (!session) {
            const signInUrl = new URL("/auth/signin", req.nextUrl.origin);
            signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
            return NextResponse.redirect(signInUrl);
        }
        return NextResponse.next();
    }

    console.log("yoooooooo")

    return NextResponse.next();
}

export const config = {
    matcher: ["/:path*"],
};

// export const config = {
//     matcher: ["/((?!api|_next/static|_next/image|favicon.ico|site\\.webmanifest|android-chrome-.*|apple-touch-icon.*|auth).*)"],
// };
