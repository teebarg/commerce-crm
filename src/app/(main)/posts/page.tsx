import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { Table as TableUI } from "@/components/table";
import { Actions } from "@/components/generic/actions";
import { type Draft } from "@prisma/client";
import { CreatePost } from "@/components/post/create-form";
import { Publish } from "@/components/post/publish";
import { UpdatePost } from "@/components/post/update-form";
import { format } from "date-fns";
import { Calendar } from "nui-react-icons";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const getPostStatus = (post: any) => {
    if (post.isPublished) return "published";
    if (post.scheduledTime) return "scheduled";
    return "draft";
};

type SearchParams = Promise<{
    page?: string;
    q?: string;
}>;

const PER_PAGE = 5;

export default async function Posts({ searchParams }: { searchParams: SearchParams }) {
    const { q, page: p = "1" } = await searchParams;
    const page = parseInt(p, 10);
    const { drafts, ...pagination } = await api.draft.all({ query: q, page, pageSize: PER_PAGE, sort: "desc" });
    const session = await auth();

    const deletePost = async (id: string) => {
        "use server";
        try {
            await api.draft.delete(id);
        } catch (error) {
            console.error("Failed to delete draft:", error);
        }
    };

    return (
        <HydrateClient>
            <div className="p-8 bg-content2 w-full">
                <div className="m-1 max-w-6xl">
                    <p className="text-2xl">Hi, {session?.user?.firstName ?? session?.user?.email} 👋🏼</p>
                    <main className="py-8">
                        <div className="space-y-8">
                            <CreatePost />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-content1 rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-default-800">Total Posts</h3>
                                    <p className="text-3xl font-bold text-blue-600 mt-2">{pagination.total}</p>
                                </div>
                                <div className="bg-content1 rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-default-800">Published</h3>
                                    <p className="text-3xl font-bold text-green-600 mt-2">
                                        {drafts?.filter((post: Draft) => post.isPublished).length}
                                    </p>
                                </div>
                                <div className="bg-content1 rounded-xl shadow-sm p-6">
                                    <h3 className="text-lg font-semibold text-default-800">Drafts & Scheduled</h3>
                                    <p className="text-3xl font-bold text-orange-600 mt-2">
                                        {drafts.filter((post: Draft) => !post.isPublished).length}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-content1 rounded-xl shadow-sm p-4">
                                <div className="py-6 px-2">
                                    <h2 className="text-xl font-semibold text-default-800">Recent Posts</h2>
                                </div>
                                <TableUI
                                    columns={["No", "Name", "Role", "", "Status", "Created At", "Actions"]}
                                    form={<CreatePost />}
                                    pagination={pagination}
                                    searchQuery={q}
                                >
                                    {drafts.map((item: Draft, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell>{(page - 1) * PER_PAGE + index + 1}</TableCell>
                                            <TableCell className="truncate max-w-28">{item.title}</TableCell>
                                            <TableCell className="truncate max-w-72">
                                                <div className="space-y-2">
                                                    <p className="text-default-800">{item.content}</p>
                                                    {item.scheduledTime && (
                                                        <div className="flex items-center gap-2 text-sm text-default-500">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>Scheduled for: {format(new Date(item.scheduledTime), "MMM d, yyyy h:mm a")}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{!item.isPublished && <Publish id={item.id} />}</TableCell>
                                            <TableCell>
                                                <Badge variant={item.isPublished ? "default" : item.scheduledTime ? "secondary" : "outline"}>
                                                    {getPostStatus(item)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-default-500">
                                                    {item.createdAt && <span>{format(new Date(item.createdAt), "MMM d, yyyy h:mm a")}</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {!item.isPublished && (
                                                    <Actions
                                                        deleteAction={deletePost}
                                                        form={<UpdatePost current={item} />}
                                                        item={item}
                                                        label="draft"
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableUI>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </HydrateClient>
    );
}
