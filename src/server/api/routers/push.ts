import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { sendNotificationsToSubscribers } from "@/trpc/services";
import {
    CreateNotificationSchema,
    CreateNotificationTemplateSchema,
    NotifySchema,
    PushSubscriptionSchema,
    UpdateNotificationSchema,
} from "@/schemas/notification.schema";

export const pushNotificationRouter = createTRPCRouter({
    templates: protectedProcedure.query(async ({ ctx }) => {
        const templates = await ctx.db.notificationTemplate.findMany({
            orderBy: { createdAt: "desc" },
        });

        return {
            templates,
        };
    }),
    notifications: protectedProcedure.query(async ({ ctx }) => {
        const notifications = await ctx.db.notification.findMany({
            orderBy: { createdAt: "desc" },
        });

        return {
            notifications,
        };
    }),
    createNotification: protectedProcedure.input(CreateNotificationSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.notification.create({
            data: {
                ...input,
                sentAt: input.status === "PUBLISHED" ? new Date() : undefined,
            },
        });
    }),
    updateNotification: protectedProcedure.input(UpdateNotificationSchema.extend({ id: z.string() })).mutation(async ({ input, ctx }) => {
        return await ctx.db.notification.update({
            where: { id: input.id },
            data: { ...input },
        });
    }),
    deleteNotification: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.notification.delete({ where: { id: input } });
    }),
    createTemplate: protectedProcedure.input(CreateNotificationTemplateSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.notificationTemplate.create({
            data: {
                ...input,
            },
        });
    }),
    updateTemplate: protectedProcedure.input(CreateNotificationTemplateSchema.extend({ id: z.string() })).mutation(async ({ input, ctx }) => {
        return await ctx.db.notificationTemplate.update({
            where: { id: input.id },
            data: { ...input },
        });
    }),
    deleteTemplate: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.notificationTemplate.delete({ where: { id: input } });
    }),

    // subscriptions
    createSubscription: publicProcedure.input(PushSubscriptionSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.pushSubscription.create({
            data: {
                ...input,
            },
        });
    }),
    getSubscription: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
        return await ctx.db.pushSubscription.findUnique({ where: { endpoint: input } });
    }),
    unsubscribe: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.pushSubscription.delete({ where: { id: input } });
    }),

    notify: publicProcedure.input(NotifySchema).mutation(async ({ input, ctx }) => {
        const subs = await ctx.db.pushSubscription.findMany({});
        const { sentSubscriptions, failedSubscriptions } = await sendNotificationsToSubscribers(subs, input);
        // update notification status to published
        await ctx.db.notification.update({
            where: { id: input.id },
            data: { status: "PUBLISHED", sentCount: sentSubscriptions.length, failedCount: failedSubscriptions.length, sentAt: new Date() },
        });
        return { message: "Notification sent successfully" };
    }),

    createEvent: publicProcedure
        .input(
            z.object({
                notificationId: z.string(),
                subscriberId: z.string(),
                eventType: z.enum(["DELIVERED", "OPENED", "CLICKED", "DISMISSED"]),
                platform: z.string(),
                deviceType: z.enum(["WEB", "IOS", "ANDROID", "DESKTOP"]),
                userAgent: z.string().optional(),
                deliveredAt: z.string().datetime().optional(),
                readAt: z.string().datetime().optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            return ctx.db.notificationEvent.create({
                data: {
                    ...input,
                    occurredAt: new Date(),
                },
            });
        }),
});
