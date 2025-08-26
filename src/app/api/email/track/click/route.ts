import { type NextRequest, NextResponse } from "next/server";
import { queueEmailEvent } from "@/lib/redis";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const campaignId = searchParams.get("c");
        const recipient = searchParams.get("r");
        const url = searchParams.get("u");

        if (!campaignId || !recipient || !url) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        // Queue the email clicked event for async processing
        await queueEmailEvent({
            type: "EMAIL_CLICKED",
            campaignId,
            recipient,
            url,
            timestamp: Date.now()
        });

        // Redirect to the destination URL
        return NextResponse.redirect(url);

    } catch (error) {
        console.error("Error tracking email click:", error);
        // Still redirect even if tracking fails
        const url = new URL(request.url).searchParams.get("u");
        if (url) {
            return NextResponse.redirect(url);
        }
        return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
    }
}
