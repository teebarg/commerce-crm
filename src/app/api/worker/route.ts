import { type NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { db } from "@/server/db";

const STREAM_NAME = "events:USER_REGISTERED";
const GROUP_NAME = "order-group";
const CONSUMER_NAME = "consumer-1";

export async function POST(request: NextRequest) {
    try {
        if (!redis) {
            return NextResponse.json({ error: "Redis not configured" }, { status: 500 });
        }

        const { limit = 50 } = await request.json();

        // const events = await redis.xrange("events:USER_REGISTERED", "-", "+", "COUNT", limit);
        // const events = await redis.xreadgroup("GROUP", GROUP_NAME, CONSUMER_NAME, [[STREAM_NAME, ">"]], {
        //     COUNT: limit,
        //     BLOCK: 5000,
        // });

        // XREADGROUP GROUP group consumer [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] ID [ID ...]
        const events = await redis.xreadgroup("GROUP", GROUP_NAME, CONSUMER_NAME, "COUNT", limit, "BLOCK", 5000, "STREAMS", STREAM_NAME, "0");
        console.log("🚀 ~ file: route.ts:25 ~ events:", events)

        if (!events.length) {
            return NextResponse.json({
                message: "No events in queue",
                processed: 0,
            });
        }

        let processedCount = 0;
        const errors: string[] = [];

        // for (const [id, fields] of events) {
        //     const data = JSON.parse(fields[1]!);
        //     try {
        //         await processNewUserEmail(data);
        //         // acknowledge the event
        //         await redis.xack(STREAM_NAME, id);
        //         // await redis.xdel("events:USER_REGISTERED", id);
        //         processedCount++;
        //     } catch (error) {
        //         const errorMsg = `Failed to process event: ${error instanceof Error ? error.message : "Unknown error"}`;
        //         errors.push(errorMsg);
        //         console.error(errorMsg, id);
        //     }
        // }

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

async function processNewUserEmail(data: { email: string; first_name: string; last_name: string; group?: string }) {
    const { email, first_name, last_name, group } = data;
    const name = first_name + last_name;

    const contact = await db.emailContact.upsert({
        where: { email },
        create: { email, name },
        update: { name: name ?? undefined },
    });

    // Add to group if specified
    if (group) {
        const emailGroup = await db.emailGroup.upsert({
            where: { slug: group },
            create: { name: group, slug: group },
            update: {},
        });

        await db.emailGroupMember.upsert({
            where: {
                contactId_groupId: {
                    contactId: contact.id,
                    groupId: emailGroup.id,
                },
            },
            create: {
                contactId: contact.id,
                groupId: emailGroup.id,
            },
            update: {},
        });
    }
}

export async function GET() {
    try {
        if (!redis) {
            return NextResponse.json({ error: "Redis not configured" }, { status: 500 });
        }

        const events = await redis.xrange("events:USER_REGISTERED", "-", "+", "COUNT", 50);

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
