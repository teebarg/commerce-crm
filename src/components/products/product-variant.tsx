import { ProductStatus, ProductVariant } from "@prisma/client";
import { useState } from "react";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit } from "nui-react-icons";
import { Trash2 } from "lucide-react";

interface ProductVariantsProps {
    variants: ProductVariant[];
    productId: number;
}

const variantFormSchema = z.object({
    name: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
    }),
    sku: z.string().optional(),
    status: z.enum(["IN_STOCK", "OUT_OF_STOCK"]),
    price: z.number().min(0, {
        message: "Price must be at least 0.",
    }),
    inventory: z.number().min(0, {
        message: "Inventory must be at least 0.",
    }),
});

const ProductVariants: React.FC<ProductVariantsProps> = ({ productId, variants = [] }) => {
    const router = useRouter();
    const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
    const [showForm, setShowForm] = useState<boolean>(false);

    const form = useForm<z.infer<typeof variantFormSchema>>({
        resolver: zodResolver(variantFormSchema),
        defaultValues: {
            name: "",
            sku: "",
            status: "IN_STOCK",
            price: 0,
            inventory: 0,
        },
    });

    const createMutation = api.product.createVariant.useMutation({
        onSuccess: async () => {
            toast.success(`Variant created successfully`);
            router.refresh();
            form.reset();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const updateMutation = api.product.updateVariant.useMutation({
        onSuccess: async () => {
            toast.success(`Variant updated successfully`);
            router.refresh();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    function onSubmit(values: z.infer<typeof variantFormSchema>) {
        if (editingVariant?.id) {
            updateMutation.mutate({ ...values, id: editingVariant.id });
        } else {
            createMutation.mutate({ productId, ...values });
        }
    }

    const handleEdit = (variant: ProductVariant) => {
        setEditingVariant(variant);
        form.setValue("name", variant.name);
        form.setValue("sku", variant.sku);
        form.setValue("status", variant.status);
        form.setValue("price", variant.price);
        form.setValue("inventory", variant.inventory);
        setShowForm(true);
    };

    const deleteVariant = api.product.deleteVariant.useMutation({
        onSuccess: async () => {
            toast.success(`Variant deleted successfully`);
            router.refresh();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    return (
        <div className="md:col-span-2 mt-4">
            <h4 className="text-lg font-medium text-default-800 mb-2">Product Variants</h4>
            <div className="p-4 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            {["Name", "SKU", "Price", "Inventory", "Status", "Actions"]?.map((variant: string, idx: number) => (
                                <th key={idx} className="px-3 py-2 text-left text-xs font-medium text-default-500 uppercase tracking-wider">
                                    {variant}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {variants?.map((variant: ProductVariant, idx: number) => (
                            <tr key={idx}>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-default-500">{variant.name}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-default-500">{variant.sku}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-default-500">{variant.price}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-default-500">{variant.inventory}</td>
                                <td className="px-3 py-2 whitespace-nowrap text-sm text-default-500">
                                    <Badge variant={variant.status === ProductStatus.IN_STOCK ? "default" : "destructive"}>{variant.status}</Badge>
                                </td>
                                <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium flex items-center">
                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(variant)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => deleteVariant.mutate(variant.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {variants.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-3 py-2 whitespace-nowrap text-sm text-default-500 text-center">
                                    No variants found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <Button className="mt-6" variant="secondary" onClick={() => setShowForm(true)}>
                    + Add Variant
                </Button>
                {showForm && (
                    <div className="bg-content1 p-4 rounded-lg mt-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
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
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter price"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="inventory"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Inventory</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter inventory"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
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
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="submit"
                                        isLoading={createMutation.isPending || updateMutation.isPending}
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                    >
                                        {editingVariant ? "Update" : "Create"}
                                    </Button>
                                    <Button type="button" variant="destructive" onClick={() => setShowForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductVariants;
