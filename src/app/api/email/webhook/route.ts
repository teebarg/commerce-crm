import { NextRequest, NextResponse } from "next/server";
import { queueEmailEvent } from "@/lib/redis";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name, group } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Queue the new user email event for async processing
        const queued = await queueEmailEvent({
            type: "NEW_USER_EMAIL",
            email,
            name,
            group,
            timestamp: Date.now()
        });

        if (!queued) {
            return NextResponse.json({ error: "Failed to queue event" }, { status: 500 });
        }

        return NextResponse.json({ 
            message: "Email queued for processing",
            queued: true 
        });

    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
