import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { notificationTemplateSchema, pushSubscriptionSchema } from "@/trpc/schema";
import { sendNotificationsToSubscribers } from "@/trpc/services";

export const pushNotificationRouter = createTRPCRouter({
    templates: protectedProcedure
        .query(async ({ ctx }) => {
            const templates = await ctx.db.notificationTemplate.findMany({
                orderBy: { createdAt: "desc" },
            });

            return {
                templates,
            };
        }),
    createTemplate: protectedProcedure.input(notificationTemplateSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.notificationTemplate.create({
            data: {
                ...input,
            },
        });
    }),
    updateTemplate: protectedProcedure.input(notificationTemplateSchema.extend({ id: z.string() })).mutation(async ({ input, ctx }) => {
        return await ctx.db.notificationTemplate.update({
            where: { id: input.id },
            data: { ...input },
        });
    }),
    deleteTemplate: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.notificationTemplate.delete({ where: { id: input } });
    }),

    // subscriptions
    createSubscription: protectedProcedure.input(pushSubscriptionSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.pushSubscription.create({
            data: {
                ...input,
            },
        });
    }),
    getSubscription: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
        return await ctx.db.pushSubscription.findUnique({ where: { id: input } });
    }),
    unsubscribe: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.pushSubscription.delete({ where: { id: input } });
    }),

    notify: publicProcedure
        .input(
            z.object({
                title: z.string().min(1),
                body: z.string().min(1),
                group: z.string().default("bot")
            })
        )
        .mutation(async ({ input, ctx }) => {
            const subs = await ctx.db.pushSubscription.findMany({});
            sendNotificationsToSubscribers(subs, input);
            return { message: "Notification sent successfully" };
        }),
});
