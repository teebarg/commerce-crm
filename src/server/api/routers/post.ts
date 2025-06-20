import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { PostSchema } from "@/schemas/post.schema";

export const postRouter = createTRPCRouter({
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
            const { query, page, pageSize, sort } = input;
            const skip = (page - 1) * pageSize;

            const posts = await ctx.db.post.findMany({
                where: query
                    ? {
                          OR: [{ title: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }],
                      }
                    : undefined,
                orderBy: { createdAt: sort },
                skip,
                take: pageSize,
            });

            const total = await ctx.db.post.count({
                where: query
                    ? {
                          OR: [{ title: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }],
                      }
                    : undefined,
            });

            return {
                posts,
                total,
                page,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize),
            };
        }),

    create: protectedProcedure.input(PostSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.post.create({
            data: {
                userId: ctx.session.user.id,
                ...input,
            },
        })
    }),

    get: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
        return await ctx.db.post.findUnique({ where: { id: input } });
    }),

    update: protectedProcedure.input(PostSchema.extend({ id: z.string() })).mutation(async ({ input, ctx }) => {
        return await ctx.db.post.update({
            where: { id: input.id },
            data: { ...input },
        });
    }),

    delete: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.post.delete({ where: { id: input } });
    }),

    publish: publicProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.post.findUnique({ where: { id: input } });
    }),
});
