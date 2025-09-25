import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { sendNotificationsToSubscribers } from "@/trpc/services";
import {
    CreateNotificationSchema,
    CreateNotificationTemplateSchema,
    NotifySchema,
    UpdateNotificationSchema,
} from "@/schemas/notification.schema";
import { PushEventSchema } from "@/schemas/base.schema";
import { redis } from "@/lib/redis";
import { TRPCError } from "@trpc/server";

const STREAM_NAME = "FCM";
const GROUP_NAME = "FCM";
const CONSUMER_NAME = "fcm-worker";

function parseStreamResponse(events: any) {
    if (!events) return [];

    return events.flatMap(([stream, entries]: [string, any[]]) =>
        entries.map(([id, fields]) => {
            const data: Record<string, string> = {};
            for (let i = 0; i < fields.length; i += 2) {
                data[fields[i]] = fields[i + 1];
            }
            return { stream, id, data };
        })
    );
}

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
    getEvents: publicProcedure.query(async () => {
        try {
            if (!redis) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Redis not configured",
                });
            }

            const events = await redis.xrange("FCM", "-", "+", "COUNT", 10);

            const parsed = events.map(([id, fields]) => {
                const data: Record<string, string> = {};
                for (let i = 0; i < fields.length; i += 2) {
                    data[fields[i]!] = fields[i + 1]!;
                }
                return { id, data };
            });

            return {
                queueLength: parsed.length,
                sampleEvents: parsed,
            };
        } catch (error) {
            console.error("Error checking queue:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to check queue",
            });
        }
    }),
    processEvents: publicProcedure.input(z.object({ limit: z.number().optional() })).mutation(async ({ ctx, input }) => {
        try {
            if (!redis) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Redis not configured",
                });
            }

            const { limit = 50 } = input;

            // const [stream, unacked]: [string, any[]] = (await redis.xautoclaim(
            //     STREAM_NAME,
            //     GROUP_NAME,
            //     CONSUMER_NAME,
            //     30_000,
            //     "0-0",
            //     "COUNT",
            //     limit
            // )) as [string, any[]];

            // const unackedParsed = (unacked ?? []).map(([id, fields]) => {
            //     const data: Record<string, string> = {};
            //     for (let i = 0; i < fields.length; i += 2) {
            //         data[fields[i]!] = fields[i + 1]!;
            //     }
            //     return { id, data };
            // });

            // if (unacked) {
            //     console.log("♻️ Reclaiming unacked events:");
            // }

            const events = await redis.xreadgroup("GROUP", GROUP_NAME, CONSUMER_NAME, "COUNT", limit, "BLOCK", 5000, "STREAMS", STREAM_NAME, ">");
            const streams = parseStreamResponse(events);
            if (!streams?.length) {
                return {
                    message: "No events in queue",
                    processed: 0,
                };
            }

            let processedCount = 0;
            const errors: string[] = [];

            for (const item of streams) {
                try {
                    await ctx.db.pushSubscription.upsert({
                        where: { endpoint: item.data.endpoint },
                        create: {
                            ...item.data,
                        },
                        update: {
                            ...item.data,
                        },
                    });
                    await redis.xack(STREAM_NAME, GROUP_NAME, item.id);
                    await redis.xdel(STREAM_NAME, item.id);
                    processedCount++;
                } catch (error) {
                    const msg = error instanceof Error ? error.message : "Unknown error";
                    errors.push(msg);
                    console.error(error);
                }
            }

            return {
                message: "Events processed",
                processed: processedCount,
                errors: errors.length > 0 ? errors : undefined,
            };
        } catch (error) {
            console.error("Worker error:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Internal server error",
            });
        }
    }),
});
