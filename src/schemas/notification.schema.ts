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
    // imageUrl: z.string().nullable().optional(),
    data: z.record(z.any()).optional(),
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
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const EmailCampaignAnalyticsSchema = z.object({
    id: z.string(),
    subject: z.string(),
    body: z.string(),
    status: NotificationStatusEnum,
    recipients: z.number(),
    openRate: z.number(),
    clickRate: z.number(),
    sentAt: z.date().nullable(),
});

export type EmailCampaignAnalytics = z.infer<typeof EmailCampaignAnalyticsSchema>;

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

export const PromotionSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    discount: z.number().optional(),
    code: z.string().optional(),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    urgency: z.string().optional(),
});

export type Promotion = z.infer<typeof PromotionSchema>;

export const EmailProductSchema = z.object({
    name: z.string(),
    price: z.string(),
    originalPrice: z.string().optional(),
    imageUrl: z.string().url(),
    url: z.string().url(),
});

export type EmailProduct = z.infer<typeof EmailProductSchema>;

export const SettingsSchema = z.object({
    socialLinks: z.any(),
    supportLink: z.string().url().optional(),
    unsubscribeLink: z.string().url().optional(),
    preferencesLink: z.string().url().optional(),
    companyName: z.string().optional(),
    companyAddress: z.string().optional(),
    companyPhone: z.string().optional(),
    contactEmail: z.string().optional(),
});

export type Settings = z.infer<typeof SettingsSchema>;

export const EmailDataSchema = z.object({
    // actionUrl: z.string().url().optional(),
    settings: SettingsSchema,
    promotion: PromotionSchema.optional(),
    featuredProducts: z.array(EmailProductSchema).optional(),
});

export type EmailData = z.infer<typeof EmailDataSchema>;

// export const CreateEmailCampaignSchema = z.object({
//     subject: z.string().min(1),
//     body: z.string().min(1),
//     actionUrl: z.string().url().optional(),
//     imageUrl: z.string().url().optional(),
//     recipients: z.array(z.string().email()).min(1).optional(),
//     groupId: z.string().optional(),
//     groupSlug: z.string().optional(),
//     data: EmailDataSchema.optional(),
// });

export const EmailCampaign = z.object({
    id: z.string(),
    subject: z.string().min(1),
    body: z.string().min(1),
    recipients: z.array(z.string().email()).min(1).optional(),
    groupId: z.string().optional(),
    groupSlug: z.string().optional(),
    status: NotificationStatusEnum,
    sentAt: z.date().nullable().optional(),
    scheduledAt: z.date().optional(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
    data: EmailDataSchema.optional(),
});

export type EmailCampaign = z.infer<typeof EmailCampaign>;

export const CreateEmailCampaignSchema = z.object({
    subject: z.string().min(1),
    body: z.string().min(1),
    recipients: z.array(z.string().email()).min(1).optional(),
    groupId: z.string().optional(),
    groupSlug: z.string().optional(),
    data: EmailDataSchema.optional(),
});

export const UpdateEmailCampaignSchema = z.object({
    id: z.string(),
    subject: z.string().min(1),
    body: z.string().min(1),
    recipients: z.array(z.string().email()).min(1).optional(),
    groupId: z.string().optional(),
    groupSlug: z.string().optional(),
    data: EmailDataSchema.optional(),
});

export type CreateEmailCampaign = z.infer<typeof CreateEmailCampaignSchema>;
export type UpdateEmailCampaign = z.infer<typeof UpdateEmailCampaignSchema>;

export type PushSubscription = z.infer<typeof PushSubscriptionSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type CreateNotification = z.infer<typeof CreateNotificationSchema>;
export type NotificationTemplate = z.infer<typeof NotificationTemplateSchema>;
export type CreateNotificationTemplate = z.infer<typeof CreateNotificationTemplateSchema>;
export type NotificationEvent = z.infer<typeof NotificationEventSchema>;
export type CreateNotificationEvent = z.infer<typeof CreateNotificationEventInput>;
export type NotificationStatusEnum = z.infer<typeof NotificationStatusEnum>;

export type Notify = z.infer<typeof NotifySchema>;
