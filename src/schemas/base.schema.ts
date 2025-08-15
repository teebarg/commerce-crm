import { z } from "zod";

export const PushEventSchema = z.object({
    notificationId: z.string(),
    subscriberId: z.string(),
    eventType: z.enum(["DELIVERED", "OPENED", "CLICKED", "DISMISSED"]),
    platform: z.string(),
    deviceType: z.enum(["WEB", "IOS", "ANDROID", "DESKTOP"]),
    userAgent: z.string().optional(),
    deliveredAt: z.string().datetime().optional(),
    readAt: z.string().datetime().optional(),
});

export type PushEventInput = z.infer<typeof PushEventSchema>;

const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().optional().nullable(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    image: z.string().url().optional().nullable(),
});

export const SessionSchema = z.object({
    user: UserSchema,
});

export type Session = z.infer<typeof SessionSchema>;
