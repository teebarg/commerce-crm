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
    scheduledAt: z.string().datetime().nullable().optional(),
    publishedAt: z.string().datetime().nullable().optional(),
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
    scheduledAt: z.string().datetime().nullable().optional(),
    publishedAt: z.string().datetime().nullable().optional(),
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
    scheduledAt: z.string().datetime().optional(),
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
                scheduledAt: z.string().datetime().optional(),
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

export type Platform = z.infer<typeof PlatformSchema>;
export type Media = z.infer<typeof MediaSchema>;
export type PlatformPost = z.infer<typeof PlatformPostSchema>;
export type Post = z.infer<typeof PostSchema>;
export type User = z.infer<typeof UserSchema>;

export type CreatePostInput = z.infer<typeof CreatePostInput>;
export type UpdatePostStatusInput = z.infer<typeof UpdatePostStatusInput>;
export type UpdatePlatformPostInput = z.infer<typeof UpdatePlatformPostInput>;

