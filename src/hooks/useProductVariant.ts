"use client";

import { useMemo } from "react";
import { type ProductSearch, type ProductVariant } from "@/schemas/product.schema";

export const useProductVariant = (product: ProductSearch) => {
    const priceInfo = useMemo(() => {
        const prices = product.variants?.map((v: ProductVariant) => v.price) || [];
        const comparePrices = product.variants?.map((v: ProductVariant) => v.old_price || v.price) || [];

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const minCompareAtPrice = Math.min(...comparePrices);
        const maxCompareAtPrice = Math.max(...comparePrices);

        const hasDiscount = product.variants?.some((v: ProductVariant) => v.old_price && v.old_price > v.price);
        const allDiscounted = product.variants?.every((v: ProductVariant) => v.old_price && v.old_price > v.price);

        const maxDiscountPercent = Math.round(((maxCompareAtPrice - minPrice) / maxCompareAtPrice) * 100);

        return {
            minPrice,
            maxPrice,
            minCompareAtPrice,
            maxCompareAtPrice,
            hasDiscount,
            allDiscounted,
            maxDiscountPercent,
        };
    }, [product.variants]);


    return {
        priceInfo,
        outOfStock: product.variants?.length == 0 || product.variants?.every((v: ProductVariant) => v.inventory <= 0),
    };
};
