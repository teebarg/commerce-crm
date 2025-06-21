import { NextResponse } from "next/server";
import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";

export async function POST(req: Request) {
    const body = await req.json();

    // Create context and caller
    const ctx = await createTRPCContext({ headers: req.headers });
    const caller = createCaller(ctx);
    try {
        const result = await caller.push.createEvent({ ...body });
        return NextResponse.json(result);
    } catch (cause) {
        if (cause instanceof TRPCError) {
            // An error from tRPC occurred
            const httpCode = getHTTPStatusCodeFromError(cause);
            return NextResponse.json({ error: cause.message }, { status: httpCode });
        }
        // Another error occurred
        console.error(cause);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
