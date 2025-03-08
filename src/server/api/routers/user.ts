import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { Role, Status } from "@prisma/client";
import argon2 from "argon2";

// Input schemas
const userInputSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email(),
    role: z.nativeEnum(Role).default("CUSTOMER"),
    status: z.nativeEnum(Status).default("PENDING"),
});

const userUpdateSchema = z.object({
    id: z.number(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    role: z.nativeEnum(Role).optional(),
    status: z.nativeEnum(Status).optional(),
    image: z.string().url().optional(),
});

export const userRouter = createTRPCRouter({
    all: protectedProcedure
        .input(
            z.object({
                query: z.string().default(""),
                page: z.number().min(1).default(1),
                pageSize: z.number().min(1).default(10),
                sort: z.enum(["asc", "desc"]).default("desc"),
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, query, sort } = input;
            const skip = (page - 1) * pageSize;

            const users = await ctx.db.user.findMany({
                where: query
                    ? {
                        OR: [{ firstName: { contains: query, mode: "insensitive" } }, { lastName: { contains: query, mode: "insensitive" } }],
                    }
                    : undefined,
                orderBy: { createdAt: sort },
                skip,
                take: pageSize,
                include: {
                    orders: true,
                    reviews: true,
                },
            });

            const total = await ctx.db.user.count({
                where: query
                    ? {
                        OR: [{ firstName: { contains: query, mode: "insensitive" } }, { lastName: { contains: query, mode: "insensitive" } }],
                    }
                    : undefined,
            });

            return {
                users,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            };
        }),

    create: protectedProcedure.input(userInputSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.user.create({
            data: {
                ...input,
                password: await argon2.hash("password"),
            },
        });
    }),

    get: publicProcedure.input(z.number().int().positive()).query(async ({ input, ctx }) => {
        return await ctx.db.user.findUnique({
            where: { id: input },
            include: {
                addresses: true,
                carts: {
                    include: {
                        items: {
                            include: {
                                variant: true,
                            },
                        },
                    },
                },
                orders: {
                    include: {
                        order_items: true,
                    },
                },
            },
        });
    }),

    update: protectedProcedure.input(userUpdateSchema).mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        return await ctx.db.user.update({
            where: { id },
            data,
        });
    }),

    delete: protectedProcedure.input(z.number().int().positive()).mutation(async ({ input, ctx }) => {
        return await ctx.db.user.delete({ where: { id: input } });
    }),

    // Get user's orders
    getUserOrders: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ input, ctx }) => {
        return await ctx.db.order.findMany({
            where: { user_id: input.userId },
            include: {
                order_items: {
                    include: {
                        variant: true,
                    },
                },
                shipping_address: true,
                billing_address: true,
            },
        });
    }),

    // Get user's cart
    getUserCart: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ input, ctx }) => {
        return await ctx.db.cart.findFirst({
            where: {
                user_id: input.userId,
                status: "ACTIVE",
            },
            include: {
                items: {
                    include: {
                        variant: true,
                    },
                },
            },
        });
    }),
});
