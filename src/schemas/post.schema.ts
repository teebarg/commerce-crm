import { type Media, type Platform, type PlatformPost, type Post } from "@prisma/client";
import { z } from "zod";

export const PostStatusEnum = z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]);

export const MediaTypeEnum = z.enum(["IMAGE", "VIDEO", "GIF"]);

export const PlatformSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    createdAt: z.date(),
});

export const MediaSchema = z.object({
    id: z.string().uuid(),
    url: z.string().url(),
    type: MediaTypeEnum,
    postId: z.string().uuid(),
    createdAt: z.date().nullable().optional(),
});

export const PlatformPostSchema = z.object({
    id: z.string().uuid(),
    postId: z.string().uuid(),
    platformId: z.string().uuid(),
    platformPostId: z.string().nullable().optional(),
    status: PostStatusEnum,
    scheduledAt: z.date().optional(),
    publishedAt: z.date().optional(),
    errorMessage: z.string().nullable().optional(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
});

export const PostSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    title: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    status: PostStatusEnum,
    scheduledAt: z.date().optional(),
    publishedAt: z.date().optional(),
    createdAt: z.date().nullable().optional(),
    updatedAt: z.date().nullable().optional(),
    media: z.array(MediaSchema),
    platformPosts: z.array(PlatformPostSchema),
});

export const UpdatePostSchema = z.object({
    id: z.string().uuid(),
    title: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    status: PostStatusEnum,
    scheduledAt: z.date().nullable().optional(),
    publishedAt: z.date().nullable().optional(),
    media: z.array(MediaSchema),
});

export const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    posts: z.array(PostSchema).optional(), // optional to avoid circular explosion
});

export const CreatePostInput = z.object({
    userId: z.string().uuid(),
    title: z.string().optional(),
    content: z.string().optional(),
    status: PostStatusEnum.default("DRAFT"),
    scheduledAt: z.date().optional(),
    media: z
        .array(
            z.object({
                url: z.string().url(),
                type: MediaTypeEnum,
            })
        )
        .optional(),
    platformPosts: z
        .array(
            z.object({
                platformId: z.string().uuid(),
                status: PostStatusEnum.default("SCHEDULED"),
                scheduledAt: z.date().optional(),
            })
        )
        .optional(),
});

export const UpdatePostStatusInput = z.object({
    postId: z.string().uuid(),
    status: PostStatusEnum,
    publishedAt: z.string().datetime().optional(),
});

export const UpdatePlatformPostInput = z.object({
    platformPostId: z.string().uuid(),
    status: PostStatusEnum,
    publishedAt: z.string().datetime().optional(),
    errorMessage: z.string().optional(),
    platformPostPlatformId: z.string().optional(),
});

// New schemas for enhanced post creation
export const AIGenerationInput = z.object({
    prompt: z.string().optional(),
    platforms: z.array(z.string()),
    tone: z.enum(["professional", "casual", "friendly", "enthusiastic", "formal"]).optional(),
    industry: z.string().optional(),
});

export const EnhancedCreatePostInput = z.object({
    content: z.string().min(1, "Content is required"),
    platforms: z.array(z.string()).min(1, "At least one platform must be selected"),
    scheduledAt: z.date().optional(),
    media: z
        .array(
            z.object({
                url: z.string().url(),
                type: MediaTypeEnum,
            })
        )
        .optional(),
    // publishNow: z.boolean().default(false),
    status: PostStatusEnum.default("DRAFT"),
});

export interface EnhancedPlatformPost extends PlatformPost {
    platform: Platform;
}

export interface EnhancedPost extends Post {
    media: Media[];
    platformPosts: EnhancedPlatformPost[];
}

export const PlatformSelectionInput = z.object({
    platforms: z.array(z.string()).min(1, "At least one platform must be selected"),
});

// export type Platform = z.infer<typeof PlatformSchema>;
// export type Media = z.infer<typeof MediaSchema>;
// export type PlatformPost = z.infer<typeof PlatformPostSchema>;
export type User = z.infer<typeof UserSchema>;

export type CreatePostInput = z.infer<typeof CreatePostInput>;
export type UpdatePostStatusInput = z.infer<typeof UpdatePostStatusInput>;
export type UpdatePlatformPostInput = z.infer<typeof UpdatePlatformPostInput>;
export type AIGenerationInput = z.infer<typeof AIGenerationInput>;
export type EnhancedCreatePostInput = z.infer<typeof EnhancedCreatePostInput>;
export type PlatformSelectionInput = z.infer<typeof PlatformSelectionInput>;

