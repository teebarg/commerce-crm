import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { PostSchema, AIGenerationInput, EnhancedCreatePostInput } from "@/schemas/post.schema";
import { env } from "@/env";
import { postToPlatforms } from "@/server/services/platformPoster";

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
        console.log("🚀 ~ update:protectedProcedure.input ~ platformPosts:", platformPosts)
        console.log("🚀 ~ update:protectedProcedure.input ~ media:", media)
        return await ctx.db.post.update({
            where: { id },
            data: updateData,
        });
    }),

    delete: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.post.delete({ where: { id: input } });
    }),

    publish: protectedProcedure.input(z.object({
        postId: z.string(),
        platforms: z.array(z.string()),
    })).mutation(async ({ ctx, input }) => {
        const { postId, platforms } = input;
        const post = await ctx.db.post.findUnique({
            where: { id: postId },
            include: {
                media: true,
                platformPosts: true,
                user: {
                    include: {
                        settings: true,
                    },
                },
            },
        });
        if (!post) throw new Error("Post not found");

        // Prepare credentials (in real app, fetch from secure config/db)
        const credentials = {
            twitter: env.TWITTER_CONSUMER_KEY ? {} : undefined,
            facebook: env.FACEBOOK_PAGE_ACCESS_TOKEN && env.FACEBOOK_PAGE_ID
                ? { pageAccessToken: env.FACEBOOK_PAGE_ACCESS_TOKEN, pageId: env.FACEBOOK_PAGE_ID }
                : undefined,
            instagram: env.INSTAGRAM_USER_ID && env.INSTAGRAM_ACCESS_TOKEN
                ? { igUserId: env.INSTAGRAM_USER_ID, accessToken: env.INSTAGRAM_ACCESS_TOKEN }
                : undefined,
            tiktok: env.TIKTOK_ACCESS_TOKEN ? { accessToken: env.TIKTOK_ACCESS_TOKEN } : undefined,
        };

        // Use the first media file as the main media (if any)
        const mediaUrl = post.media[0]?.url;
        let text = post.content ?? "";
        // Append default hashtags from user settings if present
        const userSettings = post.user?.settings;
        if (userSettings?.defaultHashtags) {
            text += `\n${userSettings.defaultHashtags}`;
        }
        // Pass handles and other settings to the posting service
        const settings = userSettings ? {
            instagram: userSettings.instagram,
            twitter: userSettings.twitter,
            facebook: userSettings.facebook,
            tiktok: userSettings.tiktok,
            timezone: userSettings.timezone,
            defaultPostTime: userSettings.defaultPostTime,
            notifications: userSettings.notifications,
        } : undefined;
        const results = await postToPlatforms({ text, mediaUrl, platforms, credentials, settings });

        // Update platform post statuses
        for (const platform of platforms) {
            const platformRecord = await ctx.db.platform.findFirst({ where: { name: platform } });
            if (!platformRecord) continue;
            await ctx.db.platformPost.updateMany({
                where: {
                    postId: post.id,
                    platformId: platformRecord.id,
                },
                data: {
                    status: results[platform]?.error ? "FAILED" : "PUBLISHED",
                    publishedAt: results[platform]?.error ? null : new Date(),
                },
            });
        }
        // Update post status to PUBLISHED if all succeeded
        const allSuccess = platforms.every((p) => !results[p]?.error);
        await ctx.db.post.update({
            where: { id: post.id },
            data: { status: allSuccess ? "PUBLISHED" : "FAILED", publishedAt: allSuccess ? new Date() : null, isPublished: allSuccess },
        });
        return { success: true, results };
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
        const platformRecords = await ctx.db.platform.findMany({
            where: { name: { in: platforms } },
        });
        if (platformRecords.length !== platforms.length) {
            throw new Error("Some platforms not found");
        }
        // If scheduling, set status to DRAFT. If publishing now, set to PUBLISHED.
        const status = publishNow ? "PUBLISHED" : "DRAFT";
        const publishedAt = publishNow ? new Date() : null;
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
                        status: publishNow ? "PUBLISHED" : "DRAFT",
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
