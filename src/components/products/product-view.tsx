"use client";

import { ExtendedProduct } from "@/types/generic";
import ProductVariants from "@/components/products/product-variant";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductForm from "@/components/products/product-form";
import { Category } from "@prisma/client";
import ProductImageManager from "@/components/products/product-images";

export function ProductView({ product, categories, onClose }: { product?: ExtendedProduct; categories: Category[]; onClose: () => void }) {
    return (
        <div className="w-[52rem] px-4 overflow-y-auto">
            <Tabs defaultValue="details">
                <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    {product && <TabsTrigger value="variants">Variants</TabsTrigger>}
                    {product && <TabsTrigger value="images">Images</TabsTrigger>}
                </TabsList>
                <TabsContent value="details">
                    <ProductForm onClose={onClose} categories={categories} product={product} />
                </TabsContent>
                {product && (
                    <TabsContent value="variants">
                        <ProductVariants productId={product.id} variants={product?.variants || []} />
                    </TabsContent>
                )}
                {product && (
                    <TabsContent value="images">
                        <div>
                            <ProductImageManager productId={product.id} initialImages={product?.images || []} />
                        </div>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
