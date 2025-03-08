import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const categoryRouter = createTRPCRouter({
    all: publicProcedure
        .input(
            z.object({
                query: z.string().default(""),
                page: z.number().default(1),
                pageSize: z.number().default(10),
                sort: z.enum(["asc", "desc"]).default("desc"),
            })
        )
        .query(async ({ input, ctx }) => {
            try {
                const skip = (input.page - 1) * input.pageSize;
                const categories = await ctx.db.category.findMany({
                    skip,
                    take: input.pageSize,
                    orderBy: { created_at: input.sort },
                });
                const total = await ctx.db.category.count();
                return {
                    categories,
                    total,
                    page: input.page,
                    pageSize: input.pageSize,
                    totalPages: Math.ceil(total / input.pageSize),
                };
            } catch (error) {
                console.error("Error fetching categories:", error);
                throw error;
            }
        }),
    get: publicProcedure.input(z.number()).query(async ({ input, ctx }) => {
        try {
            const category = await ctx.db.category.findUnique({
                where: { id: input },
            });
            if (!category) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Category not found",
                });
            }

            return category;
        } catch (error) {
            console.error("Error fetching category:", error);
            throw error;
        }
    }),
    getBySlug: publicProcedure
        .input(
            z.object({
                slug: z.string(),
            })
        )
        .query(async ({ input, ctx }) => {
            const category = await ctx.db.category.findUnique({
                where: { slug: input.slug },
            });

            if (!category) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Category not found",
                });
            }

            return category;
        }),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1).max(100),
            })
        )
        .mutation(async ({ input, ctx }) => {
            // Check if name is unique
            const existingCategory = await ctx.db.category.findUnique({
                where: { name: input.name },
            });

            if (existingCategory) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Category with this name already exists",
                });
            }

            return ctx.db.category.create({
                data: {
                    name: input.name,
                    slug: input.name.toLowerCase().replace(" ", "_"),
                },
            });
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.number(),
                name: z.string().min(1).max(100).optional(),
                slug: z.string().min(1).max(100).optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const category = await ctx.db.category.findUnique({
                where: { id: input.id },
            });

            if (!category) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Category not found",
                });
            }

            // If updating slug, check if it's unique
            if (input.slug && input.slug !== category.slug) {
                const existingCategory = await ctx.db.category.findUnique({
                    where: { slug: input.slug },
                });

                if (existingCategory) {
                    throw new TRPCError({
                        code: "CONFLICT",
                        message: "Category with this slug already exists",
                    });
                }
            }

            return ctx.db.category.update({
                where: { id: input.id },
                data: {
                    name: input.name,
                    slug: input.slug,
                },
            });
        }),
    delete: protectedProcedure.input(z.number()).mutation(async ({ input, ctx }) => {
        const category = await ctx.db.category.findUnique({
            where: { id: input },
        });

        if (!category) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Category not found",
            });
        }

        return ctx.db.category.delete({
            where: { id: input },
        });
    }),
    getWithProductCount: publicProcedure.query(async ({ ctx }) => {
        return ctx.db.category.findMany({
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { products: true },
                },
            },
        });
    }),
});
