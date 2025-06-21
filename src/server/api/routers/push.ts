import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { sendNotificationsToSubscribers } from "@/trpc/services";
import { CreateNotificationSchema, CreateNotificationTemplateSchema, NotificationSchema, PushSubscriptionSchema } from "@/schemas/notification.schema";

export const pushNotificationRouter = createTRPCRouter({
    templates: protectedProcedure.query(async ({ ctx }) => {
        const templates = await ctx.db.notification.findMany({
            orderBy: { createdAt: "desc" },
        });

        return {
            templates,
        };
    }),
    createNotification: protectedProcedure.input(CreateNotificationSchema).mutation(async ({ ctx, input }) => {
        console.log("🚀 ~ createNotification:protectedProcedure.input ~ input:", input)
        return ctx.db.notification.create({
            data: {
                ...input,
            },
        });
    }),
    createTemplate: protectedProcedure.input(CreateNotificationTemplateSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.notificationTemplate.create({
            data: {
                ...input,
            },
        });
    }),
    updateTemplate: protectedProcedure.input(NotificationSchema.extend({ id: z.string() })).mutation(async ({ input, ctx }) => {
        return await ctx.db.notification.update({
            where: { id: input.id },
            data: { ...input },
        });
    }),
    deleteTemplate: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.notification.delete({ where: { id: input } });
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

    notify: publicProcedure
        .input(
            z.object({
                title: z.string().min(1),
                body: z.string().min(1),
                group: z.string().default("bot"),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const subs = await ctx.db.pushSubscription.findMany({});
            sendNotificationsToSubscribers(subs, input);
            return { message: "Notification sent successfully" };
        }),
});
