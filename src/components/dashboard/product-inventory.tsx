"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
    id: string;
    name: string;
    category: string;
    price: string;
    stock: number;
    status: "In Stock" | "Low Stock" | "Out of Stock";
}

export function ProductInventory() {
    const [isVisible, setIsVisible] = useState(false);
    const [products, setProducts] = useState<Product[]>([
        {
            id: "1",
            name: "Apple iPhone 13 Pro",
            category: "Electronics",
            price: "$999.00",
            stock: 45,
            status: "In Stock",
        },
        {
            id: "2",
            name: "Samsung Galaxy S22",
            category: "Electronics",
            price: "$799.00",
            stock: 32,
            status: "In Stock",
        },
        {
            id: "3",
            name: "Sony WH-1000XM4",
            category: "Audio",
            price: "$349.00",
            stock: 5,
            status: "Low Stock",
        },
        {
            id: "4",
            name: 'MacBook Pro 16"',
            category: "Computers",
            price: "$2,399.00",
            stock: 0,
            status: "Out of Stock",
        },
        {
            id: "5",
            name: "iPad Air",
            category: "Tablets",
            price: "$599.00",
            stock: 18,
            status: "In Stock",
        },
    ]);

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
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product, index) => (
                                        <motion.tr
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                        >
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell>{product.price}</TableCell>
                                            <TableCell>{product.stock}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        product.status === "In Stock"
                                                            ? "default"
                                                            : product.status === "Low Stock"
                                                            ? "outline"
                                                            : "destructive"
                                                    }
                                                >
                                                    {product.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
