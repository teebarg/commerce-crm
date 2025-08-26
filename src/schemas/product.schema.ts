import { z } from "zod";

export const ProductVariantSchema: z.ZodType<any> = z.lazy(() =>
    z.object({
        id: z.number(),
        product_id: z.number(),
        sku: z.string(),
        price: z.number(),
        old_price: z.number().nullable().optional(),
        inventory: z.number(),
    })
);

export const ProductSearchSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
    sku: z.string(),
    description: z.string(),
    price: z.number(),
    old_price: z.number(),
    image: z.string(),
    images: z.array(z.string()),
    variants: z.array(ProductVariantSchema).nullable(),
    max_variant_price: z.number(),
    min_variant_price: z.number(),
});

export type ProductSearch = z.infer<typeof ProductSearchSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
