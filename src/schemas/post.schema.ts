import { z } from "zod";

export const PostStatusEnum = z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "FAILED", "DELETED"]);

export const MediaTypeEnum = z.enum(["IMAGE", "VIDEO", "GIF"]);

export const PlatformSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    createdAt: z.string().datetime(),
});

export const MediaSchema = z.object({
    id: z.string().uuid(),
    url: z.string().url(),
    type: MediaTypeEnum,
    postId: z.string().uuid(),
    createdAt: z.string().datetime(),
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
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

export const PostSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    title: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    status: PostStatusEnum,
    scheduledAt: z.date().optional(),
    publishedAt: z.date().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    media: z.array(MediaSchema),
    platformPosts: z.array(PlatformPostSchema),
});

export const UserSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().nullable().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
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
    publishNow: z.boolean().default(false),
});

export const PlatformSelectionInput = z.object({
    platforms: z.array(z.string()).min(1, "At least one platform must be selected"),
});

export type Platform = z.infer<typeof PlatformSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type PlatformPost = z.infer<typeof PlatformPostSchema>;
export type Post = z.infer<typeof PostSchema>;
export type User = z.infer<typeof UserSchema>;

export type CreatePostInput = z.infer<typeof CreatePostInput>;
export type UpdatePostStatusInput = z.infer<typeof UpdatePostStatusInput>;
export type UpdatePlatformPostInput = z.infer<typeof UpdatePlatformPostInput>;
export type AIGenerationInput = z.infer<typeof AIGenerationInput>;
export type EnhancedCreatePostInput = z.infer<typeof EnhancedCreatePostInput>;
export type PlatformSelectionInput = z.infer<typeof PlatformSelectionInput>;

