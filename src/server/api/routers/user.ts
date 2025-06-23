import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { userSchema } from "@/trpc/schema";
import { UserSettingsSchema } from "@/schemas/settings.schema";

export const userRouter = createTRPCRouter({
    users: protectedProcedure
        .input(
            z.object({
                search: z.string().default(""),
                page: z.number().min(1).default(1),
                pageSize: z.number().min(1).default(10),
                sort: z.enum(["asc", "desc"]).default("desc"),
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search, sort } = input;
            const skip = (page - 1) * pageSize;

            const users = await ctx.db.user.findMany({
                where: search
                    ? {
                          OR: [{ firstName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } }],
                      }
                    : undefined,
                orderBy: { createdAt: sort },
                skip,
                take: pageSize,
            });

            const total = await ctx.db.user.count({
                where: search
                    ? {
                          OR: [{ firstName: { contains: search, mode: "insensitive" } }, { lastName: { contains: search, mode: "insensitive" } }],
                      }
                    : undefined,
            });

            return {
                users,
                total,
                page,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize),
            };
        }),

    create: protectedProcedure.input(userSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.user.create({
            data: {
                ...input,
                password: "",
            },
        });
    }),

    get: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
        return await ctx.db.user.findUnique({ where: { id: input } });
    }),

    update: protectedProcedure.input(userSchema.extend({ id: z.string() })).mutation(async ({ input, ctx }) => {
        return await ctx.db.user.update({
            where: { id: input.id },
            data: { ...input },
        });
    }),

    delete: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.user.delete({ where: { id: input } });
    }),

    getUserSettings: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id;
        const settings = await ctx.db.userSettings.findUnique({ where: { userId } });
        return settings;
    }),

    updateUserSettings: protectedProcedure.input(UserSettingsSchema).mutation(async ({ ctx, input }) => {
        const userId = ctx.session.user.id;
        const existing = await ctx.db.userSettings.findUnique({ where: { userId } });
        if (existing) {
            return await ctx.db.userSettings.update({
                where: { userId },
                data: {
                    ...input,
                    notifications: input.notifications ? input.notifications : existing.notifications,
                },
            });
        } else {
            return await ctx.db.userSettings.create({
                data: {
                    userId,
                    ...input,
                },
            });
        }
    }),
});
