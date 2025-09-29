import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { PostSchema, EnhancedCreatePostInput, UpdatePostSchema, AIGenerationInputSchema } from "@/schemas/post.schema";
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

    update: protectedProcedure.input(UpdatePostSchema.extend({ id: z.string() })).mutation(async ({ input, ctx }) => {
        const { id, media, ...updateData } = input;
        if (media) {
            await ctx.db.media.deleteMany({
                where: { postId: id },
            });
        }
        const data = {
            ...updateData,
            media: media
                ? {
                      create: media.map((m) => ({
                          url: m.url,
                          type: m.type,
                      })),
                  }
                : undefined,
        };
        return await ctx.db.post.update({
            where: { id },
            data,
            include: {
                media: true,
            },
        });
    }),

    delete: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await ctx.db.post.delete({ where: { id: input } });
    }),

    publish: protectedProcedure
        .input(
            z.object({
                postId: z.string(),
                platforms: z.array(z.string()),
            })
        )
        .mutation(async ({ ctx, input }) => {
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

            const credentials = {
                twitter: env.TWITTER_CONSUMER_KEY ? {} : undefined,
                facebook:
                    env.FACEBOOK_PAGE_ACCESS_TOKEN && env.FACEBOOK_PAGE_ID
                        ? { pageAccessToken: env.FACEBOOK_PAGE_ACCESS_TOKEN, pageId: env.FACEBOOK_PAGE_ID }
                        : undefined,
                instagram:
                    env.INSTAGRAM_USER_ID && env.INSTAGRAM_ACCESS_TOKEN
                        ? { igUserId: env.INSTAGRAM_USER_ID, accessToken: env.INSTAGRAM_ACCESS_TOKEN }
                        : undefined,
            };

            // Use the first media file as the main media (if any)
            const mediaUrl = post?.media?.[0]?.url;
            let text = post.content ?? "";
            // Append default hashtags from user settings if present
            const userSettings = post?.user?.settings;
            if (userSettings?.defaultHashtags) {
                text += `\n${userSettings.defaultHashtags}`;
            }
            // Pass handles and other settings to the posting service
            const settings = userSettings
                ? {
                      instagram: userSettings.instagram,
                      twitter: userSettings.twitter,
                      facebook: userSettings.facebook,
                      timezone: userSettings.timezone,
                      defaultPostTime: userSettings.defaultPostTime,
                      notifications: userSettings.notifications,
                  }
                : undefined;
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
                        status: results[platform]?.error ? "DRAFT" : "PUBLISHED",
                        publishedAt: results[platform]?.error ? null : new Date(),
                    },
                });
            }
            // Update post status to PUBLISHED if all succeeded
            const allSuccess = platforms.every((p) => !results[p]?.error);
            await ctx.db.post.update({
                where: { id: post.id },
                data: { status: allSuccess ? "PUBLISHED" : "DRAFT", publishedAt: allSuccess ? new Date() : null, isPublished: allSuccess },
            });
            return { success: true, results };
        }),

    platforms: protectedProcedure.query(async ({ ctx }) => {
        const platforms = await ctx.db.platform.findMany({
            orderBy: { name: "asc" },
        });
        return platforms;
    }),
    generateAIContent: protectedProcedure.input(AIGenerationInputSchema).mutation(async ({ input }) => {
        const { platforms, tone = "friendly", industry, businessName, productService, targetAudience, specialOffer } = input;

        const platformGuidance = platforms
            .map((platform: string) => {
                switch (platform.toLowerCase()) {
                    case "instagram":
                        return "Instagram: Include 3-5 relevant hashtags, emoji usage, visual-first approach, story-like format";
                    case "facebook":
                        return "Facebook: Conversational tone, community-focused, longer form acceptable, encourage shares";
                    case "twitter":
                        return "Twitter: Concise (under 280 chars), trending hashtags, engaging questions or polls";
                    case "tiktok":
                        return "TikTok: Trendy language, hook in first 3 seconds, call for video interaction";
                    default:
                        return `${platform}: Engaging and platform-appropriate content`;
                }
            })
            .join(". ");

        const prompt = `You are an expert social media marketer. Create ONE compelling social media post that drives customers to visit a shop immediately.
    
    BUSINESS DETAILS:
    - Industry: ${industry ?? "retail business"}
    - Business Name: ${businessName ?? "[Business Name]"}
    - Product/Service: ${productService ?? "products and services"}
    - Target Audience: ${targetAudience ?? "general consumers"}
    - Special Offer: ${specialOffer ?? "quality products at great prices"}
    
    PLATFORM REQUIREMENTS:
    - Tone: ${tone}
    - Primary Platform: ${platforms[0]} ${platforms.length > 1 ? `(adaptable to: ${platforms.slice(1).join(", ")})` : ''}
    - ${platformGuidance}

    STRICT FORMAT REQUIREMENTS:
    - Output ONLY the social media post text
    - No image descriptions or extra marketing advice
    - No "Caption:" or formatting labels
    - Maximum 3-5 relevant hashtags only
    - Keep under 200 words for most platforms
    - Use emojis strategically (2-4 total)

    MUST INCLUDE:
    1. Hook: Start with an attention-grabbing question or statement
    2. Value: Why visit your shop RIGHT NOW?
    3. Urgency: Limited time, limited stock, or exclusive offer
    4. Action: Clear "Visit us at [Address]" or "Link in bio" 
    5. Incentive: Specific discount, deal, or exclusive offer

    AVOID:
    - Long explanatory text about the business
    - Multiple call-to-actions
    - Generic phrases like "check us out"
    - Bullet points or lists in the main text
    
    Create a post that makes someone want to drop what they're doing and visit the shop TODAY.`;

        try {
            const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
            const response = await genAI.models.generateContent({
                model: "gemini-2.0-flash-001",
                contents: prompt,
            });
            const content = response.text;

            return {
                content,
                platforms,
                industry: industry ?? "business",
                tone,
                generatedAt: new Date().toISOString(),
                optimizedFor: "shop_traffic_conversion",
            };
        } catch (error) {
            console.error("AI content generation failed:", error);
            throw new Error("Failed to generate content. Please try again.");
        }
    }),

    createEnhancedPost: protectedProcedure.input(EnhancedCreatePostInput).mutation(async ({ ctx, input }) => {
        const { content, platforms, scheduledAt, media, status } = input;
        const userId = ctx.session.user.id;
        const platformRecords = await ctx.db.platform.findMany({
            where: { name: { in: platforms } },
        });
        if (platformRecords.length !== platforms.length) {
            throw new Error("Some platforms not found");
        }
        // If scheduling, set status to DRAFT. If publishing now, set to PUBLISHED.
        // const publishedAt = status === "PUBLISHED" ? new Date() : null;
        const post = await ctx.db.post.create({
            data: {
                userId,
                content,
                status,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                // publishedAt,
                isPublished: false,
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
                        status,
                        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                        // publishedAt,
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
    duplicate: protectedProcedure.input(z.object({ postId: z.string() })).mutation(async ({ ctx, input }) => {
        const post = await ctx.db.post.findUnique({
            where: { id: input.postId },
            include: {
                media: true,
                platformPosts: true,
            },
        });
        if (!post) throw new Error("Post not found");
        const newPost = await ctx.db.post.create({
            data: {
                userId: ctx.session.user.id,
                content: post.content ? post.content + " (Copy)" : null,
                title: post.title ? post.title + " (Copy)" : null,
                media: {
                    create: post.media.map((m) => ({
                        url: m.url,
                        type: m.type,
                    })),
                },
                platformPosts: {
                    create: post.platformPosts.map((pp) => ({
                        platformId: pp.platformId,
                    })),
                },
            },
            include: {
                media: true,
                platformPosts: {
                    include: { platform: true },
                },
            },
        });
        return newPost;
    }),
});
