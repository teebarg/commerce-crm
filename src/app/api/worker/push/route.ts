import { type NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { db } from "@/server/db";

const STREAM_NAME = "FCM";
const GROUP_NAME = "FCM";
const CONSUMER_NAME = "fcm-worker";

function parseStreamResponse(events: any) {
    if (!events) return [];

    return events.flatMap(([stream, entries]: [string, any[]]) =>
        entries.map(([id, fields]) => {
            const data: Record<string, string> = {};
            for (let i = 0; i < fields.length; i += 2) {
                data[fields[i]] = fields[i + 1];
            }
            return { stream, id, data };
        })
    );
}

export async function POST(request: NextRequest) {
    try {
        if (!redis) {
            return NextResponse.json({ error: "Redis not configured" }, { status: 500 });
        }

        const { limit = 50 } = await request.json();
        const events = await redis.xreadgroup("GROUP", GROUP_NAME, CONSUMER_NAME, "COUNT", limit, "BLOCK", 5000, "STREAMS", STREAM_NAME, ">");
        console.log("🚀 ~ file: route.ts:31 ~ events:", events)
        const streams = parseStreamResponse(events);
        if (!streams?.length) {
            return NextResponse.json({
                message: "No events in queue",
                processed: 0,
            });
        }

        let processedCount = 0;
        const errors: string[] = [];

        for (const item of streams) {
            try {
                await db.pushSubscription.upsert({
                    where: { endpoint: item.data.endpoint },
                    create: {
                        ...item.data,
                    },
                    update: {
                        ...item.data,
                    },
                });
                // await redis.xack(STREAM_NAME, GROUP_NAME, item.id);
                processedCount++;
            } catch (error) {
                errors.push(error instanceof Error ? error.message : "Unknown error");
                console.error(error);
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

        const events = await redis.xrange("FCM", "-", "+", "COUNT", 100);

        const parsed = events.map(([id, fields]) => {
            const data: Record<string, string> = {};
            for (let i = 0; i < fields.length; i += 2) {
                data[fields[i]!] = fields[i + 1]!;
            }
            return {
                id,
                data,
            };
        });

        return NextResponse.json({
            queueLength: parsed.length,
            sampleEvents: parsed,
        });
    } catch (error) {
        console.error("Error checking queue:", error);
        return NextResponse.json({ error: "Failed to check queue" }, { status: 500 });
    }
}
