import Redis from "ioredis";
import { env } from "@/env";

const redis = env.REDIS_URL ? new Redis(env.REDIS_URL) : null;

export async function queueEmailEvent(event: {
    type: 'EMAIL_DELIVERED' | 'EMAIL_OPENED' | 'EMAIL_CLICKED';
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

export { redis };
