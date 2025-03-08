"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DrawerUI from "@/components/drawer";
import { useOverlayTriggerState } from "react-stately";
import { ExtendedProduct } from "@/types/generic";
import { ProductView } from "../products/product-view";
import { Category } from "@prisma/client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductActionsProps {
    categories: Category[];
    product: ExtendedProduct;
}

export function ProductActions({ categories, product }: ProductActionsProps) {
    const viewState = useOverlayTriggerState({});
    const router = useRouter();

    const deleteMutation = api.product.delete.useMutation({
        onSuccess: async () => {
            router.refresh();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    return (
        <div className="flex justify-end gap-1">
            <DrawerUI
                open={viewState.isOpen}
                onOpenChange={viewState.setOpen}
                direction="right"
                title={`Edit Product`}
                trigger={<Edit className="h-5 w-5" />}
            >
                <ProductView onClose={viewState.close} categories={categories} product={product} />
            </DrawerUI>
            <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(product.id)}>
                <Trash2 className="h-5 w-5 text-rose-500" />
            </Button>
        </div>
    );
}
