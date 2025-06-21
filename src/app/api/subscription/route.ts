import { NextResponse } from "next/server";
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    // Create context and caller
    const ctx = await createTRPCContext({ headers: req.headers });
    const caller = createCaller(ctx);
    try {
        const sub = await caller.push.getSubscription(query!);
        return NextResponse.json(sub);
    } catch (cause) {
        if (cause instanceof TRPCError) {
            // An error from tRPC occurred
            const httpCode = getHTTPStatusCodeFromError(cause);
            return NextResponse.json({ error: cause.message }, { status: httpCode });
        }
        return NextResponse.json({ message: "Internal server error" + cause }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const { auth, p256dh, endpoint } = body;

    // Create context and caller
    const ctx = await createTRPCContext({ headers: req.headers });
    const caller = createCaller(ctx);
    try {
        const result = await caller.push.createSubscription({ auth, p256dh, endpoint });
        return NextResponse.json(result);
    } catch (cause) {
        if (cause instanceof TRPCError) {
            // An error from tRPC occurred
            const httpCode = getHTTPStatusCodeFromError(cause);
            return NextResponse.json({ error: cause.message }, { status: httpCode });
        }
        return NextResponse.json({ message: "Internal server error" + cause }, { status: 500 });
    }
}
