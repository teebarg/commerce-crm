import Redis from "ioredis";
import { env } from "@/env";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Create Redis client
const redis = env.REDIS_URL ? new Redis(env.REDIS_URL) : null;

function extractEmailFromAny(input: unknown): string | undefined {
    if (!input) return undefined;
    if (typeof input === "string") return EMAIL_REGEX.test(input) ? input : undefined;
    if (typeof input === "object") {
        const o = input as Record<string, any>;
        const candidates = [o.email, o?.user?.email, o?.data?.email, o?.payload?.email, o?.contact?.email];
        for (const c of candidates) {
            if (typeof c === "string" && EMAIL_REGEX.test(c)) return c;
        }
    }
    return undefined;
}

async function tryLPopCount(key: string, count: number): Promise<string[]> {
    if (!redis) return [];
    try {
        const pipeline = redis.pipeline();
        for (let i = 0; i < count; i++) {
            pipeline.lpop(key);
        }
        const results = await pipeline.exec();
        if (!results) return [];
        
        const values: string[] = [];
        for (const [error, value] of results) {
            if (!error && value && typeof value === "string") {
                values.push(value);
            }
        }
        return values;
    } catch (error) {
        console.error("Redis batch lpop failed:", error);
        return [];
    }
}

async function lpopOne(key: string): Promise<string | undefined> {
    if (!redis) return undefined;
    try {
        const result = await redis.lpop(key);
        return result || undefined;
    } catch (error) {
        console.error("Redis lpop failed:", error);
        return undefined;
    }
}

/**
 * Pops up to `limit` items from the Redis list and returns parsed JSON objects (or raw strings if not JSON).
 * This removes items so they aren't re-processed next time.
 */
export async function popNewUsersFromRedisAsJson(limit = 100): Promise<any[]> {
    if (!redis) return [];
    const key = env.REDIS_NEW_USERS_KEY ?? "new_users";
    // Try batch pop first
    let raw: string[] = [];
    try {
        raw = await tryLPopCount(key, limit);
    } catch {
        raw = [];
    }
    if (raw.length === 0) {
        // Fallback to popping one-by-one
        for (let i = 0; i < limit; i++) {
            // eslint-disable-next-line no-await-in-loop
            const v = await lpopOne(key);
            if (!v) break;
            raw.push(v);
        }
    }
    const parsed: any[] = [];
    for (const item of raw) {
        try {
            parsed.push(JSON.parse(item));
        } catch {
            parsed.push(item);
        }
    }
    return parsed;
}

export async function popEmailsFromRedis(limit = 100): Promise<string[]> {
    const items = await popNewUsersFromRedisAsJson(limit);
    const emails = items.map(extractEmailFromAny).filter((e): e is string => Boolean(e));
    // de-duplicate
    return Array.from(new Set(emails));
}

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
            timestamp: event.timestamp || Date.now(),
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
