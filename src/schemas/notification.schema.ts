import { z } from "zod";

export const DeviceTypeEnum = z.enum(["WEB", "IOS", "ANDROID", "DESKTOP"]);
export const NotificationStatusEnum = z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]);

export const PushSubscriptionSchema = z.object({
    endpoint: z.string().min(1),
    p256dh: z.string().min(1),
    auth: z.string().min(1),
});

export const NotificationSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    body: z.string(),
    imageUrl: z.string().nullable().optional(),
    data: z.record(z.any()).optional(),
    status: NotificationStatusEnum,
    group: z.string().default("bot"),
    sentAt: z.date().nullable().optional(),
    scheduledAt: z.date().optional(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
});

export const CreateNotificationSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    imageUrl: z.string().optional(),
    data: z.record(z.any()).optional(),
    status: NotificationStatusEnum.default("DRAFT"),
    scheduledAt: z.date().optional(),
});

export const UpdateNotificationSchema = z.object({
    title: z.string(),
    body: z.string(),
    imageUrl: z.string().nullable().optional(),
});

export const NotifySchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    group: z.string().default("bot"),
    id: z.string(),
    imageUrl: z.string().nullable(),
    data: z.any().nullable(),
});

export const NotificationTemplateSchema = z.object({
    id: z.string().uuid(),
    code: z.string().min(1),
    title: z.string(),
    body: z.string(),
    imageUrl: z.string().optional(),
    data: z.record(z.any()).optional(),
    category: z.enum(["GENERIC", "ONBOARDING", "ENGAGEMENT", "REMINDER", "ANALYTICS"]),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const CreateNotificationTemplateSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    code: z.string().min(1),
    imageUrl: z.string().optional(),
    data: z.record(z.any()).optional(),
    category: z.enum(["GENERIC", "ONBOARDING", "ENGAGEMENT", "REMINDER", "ANALYTICS"]),
});

export const NotificationEventSchema = z.object({
    id: z.string().uuid(),
    notificationId: z.string().uuid(),
    subscriberId: z.string().uuid(),
    deliveredAt: z.string().datetime().nullable(),
    readAt: z.string().datetime().nullable(),
    eventType: z.enum(["DELIVERED", "OPENED", "CLICKED", "DISMISSED"]),
    deviceType: DeviceTypeEnum,
    platform: z.string(),
    userAgent: z.string().nullable(),
    occurredAt: z.string().datetime(),
});

export const CreateNotificationEventInput = z.object({
    notificationId: z.string().uuid(),
    subscriberIds: z.array(z.string().uuid()).min(1), // bulk creation
});

export type PushSubscription = z.infer<typeof PushSubscriptionSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
export type NotificationTemplate = z.infer<typeof NotificationTemplateSchema>;
export type CreateNotificationTemplate = z.infer<typeof CreateNotificationTemplateSchema>;
export type NotificationEvent = z.infer<typeof NotificationEventSchema>;
export type CreateNotificationEvent = z.infer<typeof CreateNotificationEventInput>;
export type NotificationStatusEnum = z.infer<typeof NotificationStatusEnum>;

export type Notify = z.infer<typeof NotifySchema>;
