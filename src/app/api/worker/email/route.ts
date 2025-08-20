import { type NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
    try {
        if (!redis) {
            return NextResponse.json({ error: "Redis not configured" }, { status: 500 });
        }

        const { limit = 50, eventType } = await request.json();

        // Get events from Redis queue
        // const events = await redis.lrange("email_events", 0, limit - 1);
        const events = await redis.xrange("events:EMAIL", "-", "+", "COUNT", limit);

        if (!events.length) {
            return NextResponse.json({
                message: "No events in queue",
                processed: 0,
            });
        }

        let processedCount = 0;
        const errors: string[] = [];

        for (const [id, fields] of events) {
            try {
                const event = JSON.parse(fields[1]!);

                const { campaignId, recipient, timestamp } = event;

                await db.emailCampaignEvent.create({
                    data: {
                        campaignId,
                        recipient,
                        eventType: event.type,
                        occurredAt: new Date(timestamp ?? Date.now()),
                    },
                });

                await redis.xdel("events:EMAIL", id);
                processedCount++;
            } catch (error) {
                const errorMsg = `Failed to process event: ${error instanceof Error ? error.message : "Unknown error"}`;
                errors.push(errorMsg);
                console.error(errorMsg, id);
            }
        }

        return NextResponse.json({
            message: "Events processed",
            processed: processedCount,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error("Worker error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        if (!redis) {
            return NextResponse.json({ error: "Redis not configured" }, { status: 500 });
        }

        const events = await redis.xrange("events:EMAIL", "-", "+", "COUNT", 50);

        const parsed = events.map(([id, fields]) => ({
            id,
            data: JSON.parse(fields[1]!),
        }));

        return NextResponse.json({
            queueLength: parsed.length,
            sampleEvents: parsed,
        });
    } catch (error) {
        console.error("Error checking queue:", error);
        return NextResponse.json({ error: "Failed to check queue" }, { status: 500 });
    }
}
