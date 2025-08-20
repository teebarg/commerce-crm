import Redis from "ioredis";
import { env } from "@/env";

// Create Redis client
const redis = env.REDIS_URL ? new Redis(env.REDIS_URL) : null;

export async function queueEmailEvent(event: {
    type: 'EMAIL_DELIVERED' | 'EMAIL_OPENED' | 'EMAIL_CLICKED' | 'NEW_USER_EMAIL';
    campaignId?: string;
    recipient?: string;
    timestamp?: number;
    url?: string;
    email?: string;
    name?: string;
    group?: string;
}) {
    if (!redis) return false;

    try {
        const eventData = {
            ...event,
            timestamp: event.timestamp ?? Date.now(),
            id: crypto.randomUUID()
        };

        await redis.rpush("email_events", JSON.stringify(eventData));
        return true;
    } catch (error) {
        console.error("Failed to queue email event:", error);
        return false;
    }
}

export async function getQueueStats() {
    if (!redis) return null;

    try {
        const queueLength = await redis.llen("email_events");
        const sampleEvents = await redis.lrange("email_events", 0, 4);

        return {
            queueLength,
            sampleEvents: sampleEvents.map((event: string) => {
                try {
                    return JSON.parse(event);
                } catch {
                    return { raw: event };
                }
            })
        };
    } catch (error) {
        console.error("Failed to get queue stats:", error);
        return null;
    }
}

// Export Redis client for the worker
export { redis };
