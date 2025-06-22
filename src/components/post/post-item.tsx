import { Edit, Trash2, Eye, Copy, Image as ImageIcon, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { Media, Platform, PlatformPost, Post } from "@prisma/client";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import Overlay from "../overlay";
import PostForm from "./post-edit-form";
import { useOverlayTriggerState } from "react-stately";
import { Confirm } from "../ui/confirm";
import PostView from "./post-view";

interface EnhancedPlatformPost extends PlatformPost {
    platform: Platform;
}

interface EnhancedPost extends Post {
    media: Media[];
    platformPosts: EnhancedPlatformPost[];
}

const PostItem: React.FC<{ post: EnhancedPost }> = ({ post }) => {
    const editState = useOverlayTriggerState({});
    const viewState = useOverlayTriggerState({});
    const deleteState = useOverlayTriggerState({});

    const platforms = [
        { id: "instagram", name: "Instagram", color: "bg-pink-500" },
        { id: "twitter", name: "Twitter", color: "bg-blue-500" },
        { id: "facebook", name: "Facebook", color: "bg-blue-600" },
    ];

    const deletePost = api.post.delete.useMutation({
        onSuccess: () => {
            toast.success("Post Deleted", {
                description: "The post has been successfully deleted.",
            });
        },
    });

    const handleDeletePost = () => {
        deletePost.mutate(post.id);
    };

    const handleDuplicatePost = () => {
        // TODO: Implement duplicate post functionality
    };

    const publishPost = api.post.publish.useMutation({
        onSuccess: () => {
            toast.success("Post Published", {
                description: "The post has been successfully published.",
            });
        },
    });

    const handlePublishPost = () => {
        publishPost.mutate(post.id);
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            published: "bg-green-100 text-green-700",
            scheduled: "bg-blue-100 text-blue-700",
            draft: "bg-gray-100 text-gray-700",
        };
        return variants[status as keyof typeof variants] || variants.draft;
    };

    const getStatusVariant = (status: string | undefined): "blue" | "emerald" | "yellow" => {
        const variantMap = {
            published: "emerald" as const,
            scheduled: "blue" as const,
            draft: "yellow" as const,
        };
        return variantMap[status as keyof typeof variantMap] || variantMap.draft;
    };

    const getVariant = (platform: string | undefined): "blue" | "emerald" | "yellow" => {
        const variantMap = {
            instagram: "blue" as const,
            twitter: "emerald" as const,
            facebook: "yellow" as const,
        };
        return variantMap[platform as keyof typeof variantMap] || variantMap.instagram;
    };

    return (
        <TableRow>
            <TableCell className="max-w-xs">
                <div className="truncate" title={post.content ?? ""}>
                    {(post?.content?.length ?? 0) > 60 ? `${post?.content?.substring(0, 60)}...` : post.content}
                </div>
            </TableCell>
            <TableCell>
                {post.media.length > 0 ? (
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {post.media.slice(0, 2).map((image: Media, index: number) => (
                                <img
                                    key={index}
                                    src={image.url}
                                    alt="Post image"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                />
                            ))}
                        </div>
                        {post.media.length > 2 && <span className="text-xs text-gray-500">+{post.media.length - 2}</span>}
                    </div>
                ) : (
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" />
                        No images
                    </span>
                )}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2 flex-wrap">
                    {post.platformPosts.map((platformPost: EnhancedPlatformPost, idx: number) => (
                        <Badge key={idx} variant={getVariant(platformPost?.platform?.name)}>
                            {platformPost?.platform?.name}
                        </Badge>
                    ))}
                </div>
            </TableCell>
            <TableCell>
                <Badge variant={getStatusVariant(post.status)}>{post.status}</Badge>
            </TableCell>
            <TableCell>
                {post.status === "SCHEDULED" && post.scheduledAt && (
                    <div className="text-sm">
                        <div>{formatDate(post.scheduledAt)}</div>
                    </div>
                )}
                {post.status === "PUBLISHED" && post.publishedAt && <div className="text-sm">{formatDate(post.publishedAt)}</div>}
                {post.status === "DRAFT" && <span className="text-gray-400 text-sm">Not scheduled</span>}
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    {post.status !== "PUBLISHED" && (
                        <>
                            <Button variant="ghost" size="sm" onClick={handlePublishPost}>
                                <Play className="h-4 w-4" />
                            </Button>
                            <Overlay
                                open={editState.isOpen}
                                title="Edit Post"
                                trigger={
                                    <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                }
                                onOpenChange={editState.setOpen}
                                sheetClassName="min-w-[500px]"
                            >
                                <PostForm onClose={editState.close} post={post} />
                            </Overlay>
                        </>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleDuplicatePost}>
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Overlay
                        open={viewState.isOpen}
                        title="View Post"
                        trigger={
                            <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                            </Button>
                        }
                        onOpenChange={viewState.setOpen}
                        sheetClassName="min-w-[70vw]"
                    >
                        <PostView onClose={viewState.close} post={post} />
                    </Overlay>

                    <Dialog open={deleteState.isOpen} onOpenChange={deleteState.setOpen}>
                        <DialogTrigger>
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader className="sr-only">
                                <DialogTitle>Delete Post</DialogTitle>
                            </DialogHeader>
                            <Confirm onClose={deleteState.close} onConfirm={handleDeletePost} />
                        </DialogContent>
                    </Dialog>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default PostItem;
