import { OrderList } from "@/components/orders/order-list";
import { api, HydrateClient } from "@/trpc/server";

type SearchParams = Promise<{
    q?: string;
    page?: string;
}>;

const PER_PAGE = 5;

export default async function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
    const { q, page: p = "1" } = await searchParams;
    const page = parseInt(p, 10);
    const { orders, ...pagination } = await api.order.all({ query: q, page, pageSize: PER_PAGE, sort: "desc" });
    // const session = await auth();

    return (
        <HydrateClient>
            <OrderList orders={orders} pagination={pagination} />
        </HydrateClient>
    );
}
