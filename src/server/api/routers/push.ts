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
import { PushEventSchema } from "@/schemas/base.schema";

export const pushNotificationRouter = createTRPCRouter({
    templates: protectedProcedure.query(async ({ ctx }) => {
        const templates = await ctx.db.notificationTemplate.findMany({
            orderBy: { createdAt: "desc" },
        });

        return {
            templates,
        };
    }),
    notifications: publicProcedure.query(async ({ ctx }) => {
        const notifications = await ctx.db.notification.findMany({
            orderBy: { createdAt: "desc" },
        });

        return {
            notifications,
        };
    }),
    analytics: protectedProcedure.query(async ({ ctx }) => {
        const [totalSubscribers, notificationsSent, activeCampaigns, deliveredEvents, openedEvents] = await Promise.all([
            ctx.db.pushSubscription.count(),
            ctx.db.notification.count({ where: { status: "PUBLISHED" } }),
            ctx.db.notification.count({ where: { status: "SCHEDULED" } }),
            ctx.db.notificationEvent.count({ where: { eventType: "DELIVERED" } }),
            ctx.db.notificationEvent.count({ where: { eventType: "OPENED" } }),
        ]);

        const openRate = deliveredEvents > 0 ? (openedEvents / deliveredEvents) * 100 : 0;

        return {
            totalSubscribers,
            notificationsSent,
            openRate,
            activeCampaigns,
        };
    }),
    notificationMetrics: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
        const [delivered, opened, dismissed] = await Promise.all([
            ctx.db.notificationEvent.count({ where: { notificationId: input, eventType: "DELIVERED" } }),
            ctx.db.notificationEvent.count({ where: { notificationId: input, eventType: "OPENED" } }),
            ctx.db.notificationEvent.count({ where: { notificationId: input, eventType: "DISMISSED" } }),
        ]);
        return { delivered, opened, dismissed };
    }),
    subscriptions: protectedProcedure.query(async ({ ctx }) => {
        const subscriptions = await ctx.db.pushSubscription.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                NotificationEvent: {
                    orderBy: { occurredAt: "desc" },
                    take: 1,
                },
            },
        });

        return { subscriptions };
    }),
    createNotification: protectedProcedure.input(CreateNotificationSchema).mutation(async ({ ctx, input }) => {
        const created = await ctx.db.notification.create({
            data: {
                ...input,
                sentAt: input.status === "PUBLISHED" ? new Date() : undefined,
            },
        });

        if (input.status === "PUBLISHED") {
            const subs = await ctx.db.pushSubscription.findMany({});
            const { sentSubscriptions, failedSubscriptions } = await sendNotificationsToSubscribers(subs, {
                id: created.id,
                title: created.title,
                body: created.body,
                group: "bot",
                imageUrl: created.imageUrl,
                data: created.data,
            });

            await ctx.db.notification.update({
                where: { id: created.id },
                data: {
                    status: "PUBLISHED",
                    sentCount: sentSubscriptions.length,
                    failedCount: failedSubscriptions.length,
                    sentAt: new Date(),
                },
            });
        }

        return created;
    }),
    updateNotification: protectedProcedure.input(UpdateNotificationSchema.extend({ id: z.string() })).mutation(async ({ input, ctx }) => {
        return await ctx.db.notification.update({
            where: { id: input.id },
            data: { ...input },
        });
    }),
    deleteNotification: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.$transaction(async (tx) => {
            await tx.notificationEvent.deleteMany({ where: { notificationId: input } });
            return await tx.notification.delete({ where: { id: input } });
        });
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
    createSubscription: publicProcedure.input(PushSubscriptionSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.pushSubscription.create({
            data: {
                ...input,
            },
        });
    }),
    syncSubscription: publicProcedure.input(PushSubscriptionSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.pushSubscription.upsert({
            where: { endpoint: input.endpoint },
            create: {
                ...input,
            },
            update: {
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

        await ctx.db.notification.update({
            where: { id: input.id },
            data: { status: "PUBLISHED", sentCount: sentSubscriptions.length, failedCount: failedSubscriptions.length, sentAt: new Date() },
        });
        return { message: "Notification sent successfully" };
    }),

    createEvent: publicProcedure.input(PushEventSchema).mutation(async ({ input, ctx }) => {
        return ctx.db.notificationEvent.create({
            data: {
                ...input,
                occurredAt: new Date(),
            },
        });
    }),
});
