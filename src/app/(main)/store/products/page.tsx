import { ProductInventory } from "@/components/dashboard/product-inventory";
import { api, HydrateClient } from "@/trpc/server";

type SearchParams = Promise<{
    q?: string;
    page?: string;
}>;

const PER_PAGE = 5;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
    const { q, page: p = "1" } = await searchParams;
    const page = parseInt(p, 10);
    const [{ products, ...pagination }, { categories }] = await Promise.all([
        api.product.all({ search: q, page, pageSize: PER_PAGE, sort: "desc" }),
        api.category.all({ query: q, page, pageSize: PER_PAGE, sort: "desc" }),
    ]);

    return (
        <HydrateClient>
            <ProductInventory categories={categories} products={products} pagination={pagination} />
        </HydrateClient>
    );
}
