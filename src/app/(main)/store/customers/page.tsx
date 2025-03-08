import { CustomerList } from "@/components/customers/customer-list";
import { api, HydrateClient } from "@/trpc/server";

type SearchParams = Promise<{
    q?: string;
    page?: string;
}>;

const PER_PAGE = 5;

export default async function CustomersPage({ searchParams }: { searchParams: SearchParams }) {
    const { q, page: p = "1" } = await searchParams;
    const page = parseInt(p, 10);
    const { users, ...pagination } = await api.user.all({ query: q, page, pageSize: PER_PAGE, sort: "desc" });
    return (
        <HydrateClient>
            <CustomerList users={users} pagination={pagination} />
        </HydrateClient>
    );
}
