import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export const productRouter = createTRPCRouter({
    all: publicProcedure
        .input(
            z.object({
                page: z.number().int().min(1).default(1),
                pageSize: z.number().int().min(1).max(100).default(10),
                categorySlug: z.string().optional(),
                search: z.string().optional(),
                sort: z.enum(["asc", "desc"]).default("desc"),
            })
        )
        .query(async ({ input, ctx }) => {
            const { page, pageSize, categorySlug, search, sort } = input;
            const skip = (page - 1) * pageSize;

            const whereQuery: Prisma.ProductWhereInput = {
                ...(categorySlug ? { categories: { some: { slug: categorySlug } } } : {}),
                ...(search
                    ? {
                        OR: [
                            { name: { contains: search, mode: "insensitive" as const } },
                            { description: { contains: search, mode: "insensitive" as const } },
                        ],
                    }
                    : {}),
            };

            const [products, total] = await Promise.all([
                ctx.db.product.findMany({
                    where: whereQuery,
                    skip,
                    take: pageSize,
                    orderBy: { created_at: sort },
                    include: {
                        variants: true,
                        categories: true,
                        images: true,
                    },
                }),
                ctx.db.product.count({ where: whereQuery }),
            ]);

            return {
                products,
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            };
        }),
    getById: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(async ({ input, ctx }) => {
        const product = await ctx.db.product.findUnique({
            where: { id: input.id },
            include: {
                variants: true,
                categories: true,
                images: true,
                reviews: { include: { user: true } },
            },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    }),
    getBySlug: publicProcedure.input(z.object({ slug: z.string().min(1) })).query(async ({ input, ctx }) => {
        const product = await ctx.db.product.findUnique({
            where: { slug: input.slug },
            include: {
                variants: true,
                categories: true,
                images: true,
                reviews: { include: { user: true } },
            },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    }),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1, "Name is required"),
                description: z.string().min(1, "Description is required"),
                categoryIds: z.array(z.number().int().positive()).optional(),
                sku: z.string().optional(),
                variants: z
                    .array(
                        z.object({
                            name: z.string().min(1, "Variant name is required"),
                            slug: z.string().min(1, "Variant slug is required"),
                            price: z.number().positive("Price must be positive"),
                            inventory: z.number().int().min(0, "Inventory cannot be negative"),
                        })
                    )
                    .optional(),
                images: z.array(z.string().url()).optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const product = await ctx.db.product.create({
                data: {
                    name: input.name,
                    slug: input.name.toLowerCase().replace(/ /g, "-"),
                    sku: input.sku || `SK${input.name.toLowerCase().replace(/ /g, "-")}`,
                    description: input.description,
                    categories: input.categoryIds ? { connect: input.categoryIds.map((id) => ({ id })) } : undefined,
                    variants: input.variants
                        ? {
                            create: input.variants.map((variant) => ({
                                name: variant.name,
                                slug: variant.name.toLowerCase().replace(/ /g, "-"),
                                sku: `SK${variant.name.toLowerCase().replace(/ /g, "-")}`,
                                price: variant.price,
                                inventory: variant.inventory,
                            })),
                        }
                        : undefined,
                    images: input.images ? { create: input.images.map((url) => ({ url })) } : undefined,
                },
                include: {
                    categories: true,
                    variants: true,
                    images: true,
                },
            });

            return product;
        }),
    update: protectedProcedure
        .input(
            z.object({
                id: z.number().int().positive(),
                name: z.string().min(1).optional(),
                description: z.string().min(1).optional(),
                categoryIds: z.array(z.number().int().positive()).optional(),
                variants: z
                    .array(
                        z.object({
                            id: z.number().int().positive().optional(), // For existing variants
                            name: z.string().min(1).optional(),
                            slug: z.string().min(1).optional(),
                            price: z.number().positive().optional(),
                            inventory: z.number().int().min(0).optional(),
                        })
                    )
                    .optional(),
                images: z.array(z.string().url()).optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id, variants, images, categoryIds, ...data } = input;

            const product = await ctx.db.product.update({
                where: { id },
                data: {
                    ...data,
                    categories: categoryIds ? { set: categoryIds.map((id) => ({ id })) } : undefined,
                    variants: variants
                        ? {
                            upsert: variants.map((variant) => ({
                                where: { id: variant.id || 0 },
                                create: {
                                    name: variant.name || "",
                                    slug: variant?.name?.toLowerCase().replace(/ /g, "-") || "",
                                    sku: `SK${variant?.name?.toLowerCase().replace(/ /g, "-") || ""}`,
                                    price: variant.price || 0,
                                    inventory: variant.inventory || 0,
                                },
                                update: {
                                    name: variant.name,
                                    slug: variant?.name?.toLowerCase().replace(/ /g, "-") || "",
                                    sku: `SK${variant?.name?.toLowerCase().replace(/ /g, "-") || ""}`,
                                    price: variant.price,
                                    inventory: variant.inventory,
                                },
                            })),
                        }
                        : undefined,
                    images: images
                        ? {
                            deleteMany: {}, // Remove existing images
                            create: images.map((url) => ({ url })),
                        }
                        : undefined,
                },
                include: {
                    variants: true,
                    categories: true,
                    images: true,
                },
            });

            return product;
        }),
    delete: protectedProcedure.input(z.number().int().positive()).mutation(async ({ input, ctx }) => {
        // Delete related data first due to foreign key constraints
        await ctx.db.productImage.deleteMany({ where: { product_id: input } });
        await ctx.db.review.deleteMany({ where: { product_id: input } });
        await ctx.db.productVariant.deleteMany({ where: { product_id: input } });

        const product = await ctx.db.product.delete({
            where: { id: input },
        });

        return product;
    }),
    addReview: protectedProcedure
        .input(
            z.object({
                productId: z.number().int().positive(),
                text: z.string().min(1, "Review text is required"),
                rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const review = await ctx.db.review.create({
                data: {
                    text: input.text,
                    rating: input.rating,
                    user_id: ctx.session.user.id as unknown as number,
                    product_id: input.productId,
                },
                include: {
                    user: true,
                    product: true,
                },
            });

            return review;
        }),
    getByCategory: publicProcedure.input(z.object({ categorySlug: z.string().min(1) })).query(async ({ input, ctx }) => {
        const products = await ctx.db.product.findMany({
            where: {
                categories: { some: { slug: input.categorySlug } },
            },
            include: {
                variants: true,
                categories: true,
                images: true,
            },
        });

        return products;
    }),
    createVariant: protectedProcedure
        .input(
            z.object({
                productId: z.number().int().positive(),
                name: z.string().min(1, "Variant name is required"),
                sku: z.string().optional(),
                price: z.number().positive("Price must be positive"),
                inventory: z.number().int().min(0, "Inventory cannot be negative"),
                status: z.enum(["IN_STOCK", "OUT_OF_STOCK"]),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const variant = await ctx.db.productVariant.create({
                data: {
                    name: input.name,
                    slug: `SK${input.name.toLowerCase().replace(/ /g, "-")}`,
                    sku: input.sku || `SK${input.name.toLowerCase().replace(/ /g, "-")}`,
                    price: input.price,
                    inventory: input.inventory,
                    product_id: input.productId,
                    status: input.status,
                },
            });

            return variant;
        }),
    updateVariant: protectedProcedure
        .input(
            z.object({
                id: z.number().int().positive(),
                name: z.string().min(1, "Variant name is required").optional(),
                slug: z.string().min(1, "Variant slug is required").optional(),
                price: z.number().positive("Price must be positive").optional(),
                inventory: z.number().int().min(0, "Inventory cannot be negative").optional(),
                status: z.enum(["IN_STOCK", "OUT_OF_STOCK"]).optional(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { id, ...data } = input;
            const variant = await ctx.db.productVariant.update({
                where: { id },
                data,
            });
            return variant;
        }),
    deleteVariant: protectedProcedure.input(z.number().int().positive()).mutation(async ({ input, ctx }) => {
        const variant = await ctx.db.productVariant.delete({
            where: { id: input },
        });
        return variant;
    }),
    uploadImage: protectedProcedure
        // .input(z.instanceof(FormData))
        // .input(z.object({
        //     formData: uploadFileSchema,
        //     productId: z.number().int().positive()
        // }),)
        .input(
            z.object({
                file: z.string(), // Base64 encoded file
                fileName: z.string(),
                contentType: z.string(),
                productId: z.number().int().positive(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const { file, fileName, contentType, productId } = input;
            // Check if product exists
            const product = await ctx.db.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Product not found",
                });
            }

            // Upload the file to Supabase Storage
            const { data, error } = await supabase.storage
                .from("product-images") // Your bucket name
                .upload(fileName, Buffer.from(file, "base64"), {
                    contentType,
                });

            if (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Upload failed: ${error.message}`,
                });
            }

            console.log("🚀 ~ .mutation ~ data:", data);
            console.log("........");
            console.log("🚀 ~ .mutation ~ error:", error);

            // Get public URL
            const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(fileName);

            // Create image record in database
            const image = await ctx.db.productImage.create({
                data: {
                    url: publicUrlData.publicUrl,
                    product_id: productId,
                },
            });

            console.log("🚀 ~ .mutation ~ image:", image);

            return image;

            return { url: data?.path };
            // Parse FormData
            // const formData = await req.formData();
            // const file = formData.get("file") as File;
            // console.log("🚀 ~ .mutation ~ file:", file)
            // const productId = parseInt(formData.get("productId") as string, 10);
            // console.log("🚀 ~ .mutation ~ productId:", productId)

            // console.log("🚀 ~ .mutation ~ input:", input)
            // const file = input.formData.image;
            // const productId = input.productId;

            // console.log("🚀 ~ .mutation ~ file:", file.name)
            // console.log("........")

            // if (!file || !productId) {
            //     throw new TRPCError({
            //         code: 'BAD_REQUEST',
            //         message: 'File and productId are required',
            //     });
            // }

            // // Generate unique filename
            // const fileExt = file.name.split('.').pop();
            // const fileName = `${productId}/${crypto.randomUUID()}.${fileExt}`;

            // // Upload to Supabase Storage
            // const { data, error } = await supabase.storage
            //     .from('product-images')
            //     .upload(fileName, file, {
            //         cacheControl: '3600',
            //         upsert: false,
            //     });

            // if (error) {
            //     throw new TRPCError({
            //         code: 'INTERNAL_SERVER_ERROR',
            //         message: `Upload failed: ${error.message}`,
            //     });
            // }

            // // Get public URL
            // const { data: publicUrlData } = supabase.storage
            //     .from('product-images')
            //     .getPublicUrl(fileName);

            // // Create image record in database
            // const image = await ctx.db.productImage.create({
            //     data: {
            //         url: publicUrlData.publicUrl,
            //         product_id: productId,
            //     },
            // });

            // return image;
        }),
    deleteImage: protectedProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const image = await ctx.db.productImage.findUnique({
                where: { id: input.id },
            });

            if (!image) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Image not found",
                });
            }

            // Extract file path from URL
            const filePath = image.url.split("/storage/v1/object/public/product-images/")[1];

            // Delete from Supabase Storage
            const { error } = await supabase.storage.from("product-images").remove([filePath!]);

            if (error) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Delete failed: ${error.message}`,
                });
            }

            // Delete from database
            await ctx.db.productImage.delete({
                where: { id: input.id },
            });

            return { success: true };
        }),
});
