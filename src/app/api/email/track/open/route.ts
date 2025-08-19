import { NextRequest, NextResponse } from "next/server";
import { queueEmailEvent } from "@/lib/redis";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const campaignId = searchParams.get("c");
        const recipient = searchParams.get("r");

        if (!campaignId || !recipient) {
            return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        // Queue the email opened event for async processing
        await queueEmailEvent({
            type: "EMAIL_OPENED",
            campaignId,
            recipient,
            timestamp: Date.now()
        });

        // Return a 1x1 transparent GIF
        const gif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
        
        return new NextResponse(gif, {
            headers: {
                "Content-Type": "image/gif",
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        });

    } catch (error) {
        console.error("Error tracking email open:", error);
        // Still return the GIF even if tracking fails
        const gif = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
        return new NextResponse(gif, {
            headers: { "Content-Type": "image/gif" }
        });
    }
}
