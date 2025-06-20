import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { Table } from "@/components/ui/table";
import { Actions } from "@/components/generic/actions";
import { type Post } from "@prisma/client";
import { CreatePost } from "@/components/post/create-form";
import { Publish } from "@/components/post/publish";
import { UpdatePost } from "@/components/post/update-form";
import { format } from "date-fns";
import { Calendar } from "nui-react-icons";

const getPostStatus = (post: any) => {
    if (post.is_published) return "published";
    if (post.scheduled_at) return "scheduled";
    return "draft";
};

const getStatusStyle = (status: string) => {
    switch (status) {
        case "published":
            return "bg-green-100 text-green-700";
        case "scheduled":
            return "bg-purple-100 text-purple-700";
        default:
            return "bg-orange-100 text-orange-700";
    }
};

type SearchParams = Promise<{
    page?: string;
    q?: string;
}>;

const PER_PAGE = 5;

export default async function Posts({ searchParams }: { searchParams: SearchParams }) {
    const { q, page: p = "1" } = await searchParams;
    const page = parseInt(p, 10)
    const { posts, ...pagination } = await api.post.all({ query: q, page, pageSize: PER_PAGE, sort: "desc" });
    const session = await auth();

    const deletePost = async (id: string) => {
        "use server";
        try {
            await api.post.delete(id);
        } catch (error) {
            console.error("Failed to delete post:", error);
        }
    };

    return (
        <HydrateClient>
            <div className="p-8 bg-card w-full">
                <div className="m-1 max-w-6xl">
                    <p className="text-2xl">Hi, {session?.user?.firstName ?? session?.user?.email} 👋🏼</p>
                    <main className="py-8">
                        <div className="space-y-8">
                            <CreatePost />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-content1 rounded-xl shadow-xs p-6">
                                    <h3 className="text-lg font-semibold text-default-800">Total Posts</h3>
                                    <p className="text-3xl font-bold text-blue-600 mt-2">{pagination.total}</p>
                                </div>
                                <div className="bg-content1 rounded-xl shadow-xs p-6">
                                    <h3 className="text-lg font-semibold text-default-800">Published</h3>
                                    <p className="text-3xl font-bold text-green-600 mt-2">
                                        {posts?.filter((post: Post) => post.isPublished).length}
                                    </p>
                                </div>
                                <div className="bg-content1 rounded-xl shadow-xs p-6">
                                    <h3 className="text-lg font-semibold text-default-800">Posts & Scheduled</h3>
                                    <p className="text-3xl font-bold text-orange-600 mt-2">
                                        {posts.filter((post: Post) => !post.isPublished).length}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-content1 rounded-xl shadow-xs p-4">
                                <div className="py-6 px-2">
                                    <h2 className="text-xl font-semibold text-default-800">Recent Posts</h2>
                                </div>
                                <Table
                                    columns={["No", "Name", "Role", "Status", "Created At"]}
                                    form={<CreatePost />}
                                    pagination={pagination}
                                    searchQuery={q}
                                >
                                    {posts.map((item: Post, index: number) => (
                                        <tr key={index} className="even:bg-content1">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3">
                                                {(page - 1) * PER_PAGE + index + 1}
                                            </td>
                                            <td className="truncate max-w-28">{item.title}</td>
                                            <td className="truncate max-w-72">
                                                <div className="space-y-2">
                                                    <p className="text-default-800">{item.content}</p>
                                                    {item.scheduledTime && (
                                                        <div className="flex items-center gap-2 text-sm text-default-500">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>Scheduled for: {format(new Date(item.scheduledTime), "MMM d, yyyy h:mm a")}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">{!item.isPublished && <Publish id={item.id} />}</div>
                                            </td>
                                            <td>
                                                <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(getPostStatus(item))}`}>
                                                    {getPostStatus(item)}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="text-sm text-default-500">
                                                    {item.createdAt && <span>{format(new Date(item.createdAt), "MMM d, yyyy h:mm a")}</span>}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">{new Date(item.createdAt!).toLocaleDateString()}</td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                                                {!item.isPublished && (
                                                    <Actions
                                                        deleteAction={deletePost}
                                                        form={<UpdatePost current={item} />}
                                                        item={item}
                                                        label="post"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </Table>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </HydrateClient>
    );
}
