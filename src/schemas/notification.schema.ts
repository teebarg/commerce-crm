import { z } from "zod";

export const DeviceTypeEnum = z.enum(["WEB", "IOS", "ANDROID", "DESKTOP"]);
export const NotificationStatusEnum = z.enum(["DRAFT", "SCHEDULED", "PUBLISHED",]);

export const PushSubscriptionSchema = z.object({
    endpoint: z.string().min(1),
    p256dh: z.string().min(1),
    auth: z.string().min(1),
});

export const NotificationSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    body: z.string(),
    imageUrl: z.string().optional(),
    data: z.record(z.any()).optional(),
    status: NotificationStatusEnum,
    sentAt: z.string().datetime().nullable(),
    scheduledAt: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const CreateNotificationSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    imageUrl: z.string().optional(),
    data: z.record(z.any()).optional(), // optional payload like { postId: "..." }
    status: NotificationStatusEnum.default("DRAFT"),
    scheduledAt: z.date().optional(),
});

export const NotificationTemplateSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    body: z.string(),
    imageUrl: z.string().optional(),
    data: z.record(z.any()).optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const CreateNotificationTemplateSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
    code: z.string().min(1),
    imageUrl: z.string().optional(),
    data: z.record(z.any()).optional(),
});

export const NotificationRecipientSchema = z.object({
    id: z.string().uuid(),
    notificationId: z.string().uuid(),
    subscriberId: z.string().uuid(),
    deliveredAt: z.string().datetime().nullable(),
    readAt: z.string().datetime().nullable(),
});

export const CreateNotificationRecipientsInput = z.object({
    notificationId: z.string().uuid(),
    subscriberIds: z.array(z.string().uuid()).min(1), // bulk creation
});


export type PushSubscription = z.infer<typeof PushSubscriptionSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
export type NotificationTemplate = z.infer<typeof NotificationTemplateSchema>;
export type CreateNotificationTemplate = z.infer<typeof CreateNotificationTemplateSchema>;
export type NotificationRecipient = z.infer<typeof NotificationRecipientSchema>;
export type CreateNotificationRecipientsInput = z.infer<typeof CreateNotificationRecipientsInput>;
export type NotificationStatusEnum = z.infer<typeof NotificationStatusEnum>;
