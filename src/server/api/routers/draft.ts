import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { draftSchema } from "@/trpc/schema";

export const draftRouter = createTRPCRouter({
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

            const drafts = await ctx.db.draft.findMany({
                where: query
                    ? {
                          OR: [{ title: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }],
                      }
                    : undefined,
                orderBy: { createdAt: sort },
                skip,
                take: pageSize,
            });

            const total = await ctx.db.draft.count({
                where: query
                    ? {
                          OR: [{ title: { contains: query, mode: "insensitive" } }, { content: { contains: query, mode: "insensitive" } }],
                      }
                    : undefined,
            });

            return {
                drafts,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            };
        }),

    create: protectedProcedure.input(draftSchema).mutation(async ({ ctx, input }) => {
        return ctx.db.draft.create({
            data: {
                userId: ctx.session.user.id as unknown as number,
                ...input,
            },
        })
    }),

    get: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
        return await ctx.db.draft.findUnique({ where: { id: input } });
    }),

    update: protectedProcedure.input(draftSchema.extend({ id: z.string() })).mutation(async ({ input, ctx }) => {
        return await ctx.db.draft.update({
            where: { id: input.id },
            data: { ...input },
        });
    }),

    delete: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.draft.delete({ where: { id: input } });
    }),

    publish: publicProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.draft.findUnique({ where: { id: input } });
    }),
});
