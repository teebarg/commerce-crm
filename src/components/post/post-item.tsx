import { Edit, Trash2, Eye, Copy, Image as ImageIcon, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { type Media } from "@prisma/client";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import Overlay from "@/components/overlay";
import PostForm from "@/components/post/post-edit-form";
import { useOverlayTriggerState } from "react-stately";
import { Confirm } from "@/components/ui/confirm";
import PostView from "@/components/post/post-view";
import Image from "next/image";
import { type EnhancedPlatformPost, type EnhancedPost } from "@/schemas/post.schema";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PostItemProps {
    post: EnhancedPost;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
    const editState = useOverlayTriggerState({});
    const viewState = useOverlayTriggerState({});
    const deleteState = useOverlayTriggerState({});
    const utils = api.useUtils();

    const deletePost = api.post.delete.useMutation({
        onSuccess: () => {
            toast.success("Post Deleted", {
                description: "The post has been successfully deleted.",
            });
        },
    });

    const duplicatePost = api.post.duplicate.useMutation({
        onSuccess: () => {
            void utils.post.invalidate();
            toast.success("Post duplicated", {
                description: "A copy of this post has been created as a draft.",
            });
        },
        onError: (err) => {
            toast.error("Failed to duplicate post", { description: err.message });
        },
    });

    const handleDeletePost = () => {
        deletePost.mutate(post.id);
    };

    const handleDuplicatePost = () => {
        duplicatePost.mutate({ postId: post.id });
    };

    const publishPost = api.post.publish.useMutation({
        onSuccess: () => {
            toast.success("Post Published", {
                description: "The post has been successfully published.",
            });
        },
    });

    const handlePublishPost = () => {
        publishPost.mutate({ postId: post.id, platforms: post.platformPosts.map((pp: EnhancedPlatformPost) => pp.platform.name) });
    };

    const getVariant = (platform: string | undefined): "blue" | "emerald" | "yellow" => {
        const variantMap = {
            instagram: "blue" as const,
            twitter: "emerald" as const,
            facebook: "yellow" as const,
        };
        return variantMap[platform as keyof typeof variantMap] || variantMap.instagram;
    };

    const openPlatformComposer = async (platform: string) => {
        const content = post.content ?? "";
        try {
            await navigator.clipboard.writeText(content);
            toast.success("Content copied to clipboard", { description: `Paste in ${platform} composer` });
        } catch {
            // no-op if clipboard fails
        }

        const firstMediaUrl = post.media?.[0]?.url;
        const map: Record<string, string> = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`,
            facebook: firstMediaUrl
                ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(firstMediaUrl)}`
                : `https://www.facebook.com/`,
            instagram: `https://www.instagram.com/`,
        };
        const url = map[platform.toLowerCase()] ?? "";
        if (url) window.open(url, "_blank", "noopener,noreferrer");
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
                                <Image
                                    key={index}
                                    src={image.url}
                                    alt="Post image"
                                    className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                    width={100}
                                    height={100}
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
                <Badge variant="outline">{post.status}</Badge>
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" title="Post to platform">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {post.platformPosts.map((pp: EnhancedPlatformPost, i: number) => (
                                        <DropdownMenuItem key={i} onClick={() => openPlatformComposer(pp.platform.name)} className="cursor-pointer">
                                            Open {pp.platform.name}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                    {post.status === "PUBLISHED" && (
                        <Button variant="ghost" size="sm" onClick={handleDuplicatePost}>
                            <Copy className="h-4 w-4" />
                        </Button>
                    )}
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
                        <PostView post={post} />
                    </Overlay>

                    <Dialog open={deleteState.isOpen} onOpenChange={deleteState.setOpen}>
                        <DialogTrigger>
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader className="sr-only">
                                <DialogTitle>Delete Post</DialogTitle>
                            </DialogHeader>
                            <Confirm onClose={deleteState.close} onConfirm={handleDeletePost} isLoading={deletePost.isPending} />
                        </DialogContent>
                    </Dialog>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default PostItem;
