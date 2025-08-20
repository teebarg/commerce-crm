import { type NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
    try {
        if (!redis) {
            return NextResponse.json(
                { error: "Redis not configured" },
                { status: 500 }
            );
        }

        const { limit = 50, eventType } = await request.json();

        // Get events from Redis queue
        const events = await redis.lrange("email_events", 0, limit - 1);

        if (!events.length) {
            return NextResponse.json({
                message: "No events in queue",
                processed: 0
            });
        }

        let processedCount = 0;
        const errors: string[] = [];

        for (const eventStr of events) {
            try {
                const event = JSON.parse(eventStr);

                // Process based on event type
                switch (event.type) {
                    case "EMAIL_DELIVERED":
                        await processEmailDelivered(event);
                        break;
                    case "EMAIL_OPENED":
                        await processEmailOpened(event);
                        break;
                    case "EMAIL_CLICKED":
                        await processEmailClicked(event);
                        break;
                    case "NEW_USER_EMAIL":
                        await processNewUserEmail(event);
                        break;
                    default:
                        console.warn(`Unknown event type: ${event.type}`);
                        continue;
                }

                // Remove processed event from queue
                await redis.lrem("email_events", 1, eventStr);
                processedCount++;

            } catch (error) {
                const errorMsg = `Failed to process event: ${error instanceof Error ? error.message : 'Unknown error'}`;
                errors.push(errorMsg);
                console.error(errorMsg, eventStr);
            }
        }

        return NextResponse.json({
            message: "Events processed",
            processed: processedCount,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error("Worker error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

async function processEmailDelivered(event: any) {
    const { campaignId, recipient, timestamp } = event;

    await db.emailCampaignEvent.create({
        data: {
            campaignId,
            recipient,
            eventType: "DELIVERED",
            occurredAt: new Date(timestamp ?? Date.now())
        }
    });
}

async function processEmailOpened(event: any) {
    const { campaignId, recipient, timestamp } = event;

    await db.emailCampaignEvent.create({
        data: {
            campaignId,
            recipient,
            eventType: "OPENED",
            occurredAt: new Date(timestamp ?? Date.now())
        }
    });
}

async function processEmailClicked(event: any) {
    const { campaignId, recipient, timestamp, url } = event;

    await db.emailCampaignEvent.create({
        data: {
            campaignId,
            recipient,
            eventType: "CLICKED",
            occurredAt: new Date(timestamp ?? Date.now())
        }
    });
}

async function processNewUserEmail(event: any) {
    const { email, name, group } = event;

    // Upsert email contact
    const contact = await db.emailContact.upsert({
        where: { email },
        create: { email, name },
        update: { name: name ?? undefined }
    });

    // Add to group if specified
    if (group) {
        const emailGroup = await db.emailGroup.upsert({
            where: { slug: group },
            create: { name: group, slug: group },
            update: {}
        });

        await db.emailGroupMember.upsert({
            where: {
                contactId_groupId: {
                    contactId: contact.id,
                    groupId: emailGroup.id
                }
            },
            create: {
                contactId: contact.id,
                groupId: emailGroup.id
            },
            update: {}
        });
    }
}

// GET endpoint to check queue status
export async function GET() {
    try {
        if (!redis) {
            return NextResponse.json(
                { error: "Redis not configured" },
                { status: 500 }
            );
        }

        // Read up to 50 events from the stream (from the beginning "0")
        const events = await redis.xrange("events:USER_REGISTERED", "-", "+", "COUNT", 50);

        // Transform to usable objects
        const parsed = events.map(([id, fields]) => ({
            id,
            data: JSON.parse(fields[1]!),
        }));

        console.log("🚀 ~ GET ~ parsed:", parsed)

        return NextResponse.json({
            queueLength: parsed.length,
            sampleEvents: parsed
            // sampleEvents: sampleEvents.map(event => {
            //     try {
            //         // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            //         return JSON.parse(event);
            //     } catch {
            //         return { raw: event };
            //     }
            // })
        });
    } catch (error) {
        console.error("Error checking queue:", error);
        return NextResponse.json(
            { error: "Failed to check queue" },
            { status: 500 }
        );
    }
}
