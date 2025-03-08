"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ProductStatus } from "@prisma/client";
import PaginationUI from "@/components/pagination";
import DrawerUI from "@/components/drawer";
import { useOverlayTriggerState } from "react-stately";
import { ExtendedProduct } from "@/types/generic";
import { ProductView } from "@/components/products/product-view";
import { Category } from "@prisma/client";
import { ProductActions } from "@/components/products/product-actions";

interface ProductInventoryProps {
    products: ExtendedProduct[];
    categories: Category[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

export function ProductInventory({ categories, products, pagination }: ProductInventoryProps) {
    const addState = useOverlayTriggerState({});
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Inventory</CardTitle>
                <CardDescription>Manage your product inventory and stock levels.</CardDescription>
            </CardHeader>
            <CardContent>
                <AnimatePresence>
                    {isVisible && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                            <DrawerUI
                                open={addState.isOpen}
                                onOpenChange={addState.setOpen}
                                direction="right"
                                title={`Add Product`}
                                trigger={
                                    <span className="h-10 rounded-md px-8 mb-4 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none">
                                        Add Product
                                    </span>
                                }
                            >
                                <ProductView onClose={addState.close} categories={categories} />
                            </DrawerUI>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Sku</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Categories</TableHead>
                                        <TableHead>Variant</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product: ExtendedProduct, index: number) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                        >
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.sku}</TableCell>
                                            <TableCell>{product.description}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    {product.categories.map((category: Category, index: number) => (
                                                        <Badge key={index} variant="secondary">
                                                            {category.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>{product.variants.length}</TableCell>
                                            <TableCell>
                                                <Badge variant={product.status === ProductStatus.IN_STOCK ? "default" : "destructive"}>
                                                    {product.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <ProductActions categories={categories} product={product} />
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                            <PaginationUI pagination={pagination} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
