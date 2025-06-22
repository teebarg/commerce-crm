import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { PostSchema, AIGenerationInput, EnhancedCreatePostInput } from "@/schemas/post.schema";
import { env } from "@/env";

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
                include: {
                    media: true,
                    platformPosts: {
                        include: {
                            platform: true,
                        },
                    },
                },
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
        const { media, platformPosts, ...postData } = input;
        return ctx.db.post.create({
            data: {
                ...postData,
                userId: ctx.session.user.id,
            },
        });
    }),

    get: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
        return await ctx.db.post.findUnique({
            where: { id: input },
            include: {
                media: true,
                platformPosts: {
                    include: {
                        platform: true,
                    },
                },
            },
        });
    }),

    update: protectedProcedure.input(PostSchema.extend({ id: z.string() })).mutation(async ({ input, ctx }) => {
        const { id, media, platformPosts, ...updateData } = input;
        return await ctx.db.post.update({
            where: { id },
            data: updateData,
        });
    }),

    delete: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.post.delete({ where: { id: input } });
    }),

    publish: publicProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.post.findUnique({ where: { id: input } });
    }),

    // New endpoints for enhanced functionality
    platforms: protectedProcedure.query(async ({ ctx }) => {
        const platforms = await ctx.db.platform.findMany({
            orderBy: { name: "asc" },
        });
        return platforms;
    }),

    generateAIContent: protectedProcedure.input(AIGenerationInput).mutation(async ({ input }) => {
        const { platforms, tone = "friendly", industry } = input;
        const prompt = `Generate a social media post for the following industry: ${industry ?? "business"}.\nTone: ${tone}.\nPlatforms: ${platforms.join(", ")}.`;

        const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
        const response = await genAI.models.generateContent({
            model: "gemini-2.0-flash-001",
            contents: prompt,
        });
        const content = response.text;

        return {
            content,
            platforms,
            generatedAt: new Date().toISOString(),
        };
    }),

    createEnhancedPost: protectedProcedure.input(EnhancedCreatePostInput).mutation(async ({ ctx, input }) => {
        const { content, platforms, scheduledAt, media, publishNow } = input;
        const userId = ctx.session.user.id;

        // Get platform IDs
        const platformRecords = await ctx.db.platform.findMany({
            where: { name: { in: platforms } },
        });

        if (platformRecords.length !== platforms.length) {
            throw new Error("Some platforms not found");
        }

        const status = publishNow ? "PUBLISHED" : scheduledAt ? "SCHEDULED" : "DRAFT";
        const publishedAt = publishNow ? new Date() : null;

        // Create the post
        const post = await ctx.db.post.create({
            data: {
                userId,
                content,
                status,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                publishedAt,
                isPublished: publishNow,
                media: media
                    ? {
                          create: media.map((m) => ({
                              url: m.url,
                              type: m.type,
                          })),
                      }
                    : undefined,
                platformPosts: {
                    create: platformRecords.map((platform) => ({
                        platformId: platform.id,
                        status: publishNow ? "PUBLISHED" : scheduledAt ? "SCHEDULED" : "DRAFT",
                        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                        publishedAt,
                    })),
                },
            },
            include: {
                media: true,
                platformPosts: {
                    include: {
                        platform: true,
                    },
                },
            },
        });

        return post;
    }),

    uploadMedia: protectedProcedure
        .input(
            z.object({
                url: z.string().url(),
                type: z.enum(["IMAGE", "VIDEO", "GIF"]),
                postId: z.string().uuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.db.media.create({
                data: {
                    ...input,
                },
            });
        }),

    deleteMedia: protectedProcedure.input(z.string().uuid()).mutation(async ({ ctx, input }) => {
        return await ctx.db.media.delete({
            where: { id: input },
        });
    }),
    getPlatforms: publicProcedure.query(async ({ ctx }) => {
        return await ctx.db.platform.findMany({
            orderBy: { name: "asc" },
        });
    }),
});
