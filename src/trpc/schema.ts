import { z } from "zod";

export const draftSchema = z.object({
    content: z.string().min(1),
    title: z.string().default(""),
    scheduledTime: z.date().optional(),
});

export const userSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().min(1).email(),
});

export const pushSubscriptionSchema = z.object({
    endpoint: z.string().min(1),
    p256dh: z.string().min(1),
    auth: z.string().min(1),
});

export const notificationTemplateSchema = z.object({
    icon: z.string().default("🎉").nullable().optional(),
    title: z.string().min(1),
    body: z.string().min(1),
    excerpt: z.string().default("").nullable().optional(),
});

export interface QueueStats {
    queueLength: number;
    sampleEvents: Array<{
        id: string;
        data: {
            id?: string;
            type: string;
            campaignId?: string;
            recipient?: string;
            email?: string;
            timestamp?: number;
            raw?: string;
        };
    }>;
}
