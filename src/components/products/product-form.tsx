"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ExtendedProduct } from "@/types/generic";
import MultiSelectCombobox from "@/components/ui/combobox";
import { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    categories: z.array(z.any()).min(1, {
        message: "Please select at least one category.",
    }),
    sku: z.string().optional(),
    status: z.string().min(3, {
        message: "Status must be at least 3 characters.",
    }),
});

const ProductForm: React.FC<{ categories: Category[]; product?: ExtendedProduct; onClose: () => void }> = ({ categories, product, onClose }) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: product?.name || "",
            description: product?.description || "",
            sku: product?.sku || "",
            status: product?.status || "",
            categories: product?.categories || [],
        },
    });

    const createMutation = api.product.create.useMutation({
        onSuccess: async () => {
            toast.success(`Product created successfully`);
            router.refresh();
            onClose?.();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const updateMutation = api.product.update.useMutation({
        onSuccess: async () => {
            toast.success(`Product updated successfully`);
            router.refresh();
            onClose?.();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const { categories, ...data } = values;
        const categoryIds = categories.map((category) => category.id);

        if (product?.id) {
            updateMutation.mutate({ ...data, id: product.id, categoryIds });
        } else {
            createMutation.mutate({ ...data, categoryIds });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full">
                <div className="rounded-lg shadow-xl w-full overflow-y-autop h-fullp">
                    {/* Product Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sku"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter SKU" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="IN_STOCK">In Stock</SelectItem>
                                                <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea rows={4} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="md:col-span-2 relative">
                            <label className="block text-sm font-medium text-default-700 mb-1">Categories</label>
                            <FormField
                                control={form.control}
                                name="categories"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <MultiSelectCombobox
                                                options={categories}
                                                onChange={field.onChange}
                                                value={field.value}
                                                name={field.name}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex gap-2 justify-end col-span-2">
                            <Button variant="destructive" type="button" onClick={() => onClose()}>
                                Close
                            </Button>
                            <Button
                                isLoading={createMutation.isPending || updateMutation.isPending}
                                type="submit"
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                {product?.id ? "Update" : "Create"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default ProductForm;
