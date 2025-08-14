import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import PostMediaManager from "./post-media-manager";
import { Input } from "@/components/ui/input";
import { type EnhancedPost } from "@/schemas/post.schema";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { UpdatePostSchema } from "@/schemas/post.schema";

const PostForm: React.FC<{ post: EnhancedPost; onClose: () => void }> = ({ post, onClose }) => {
    const utils = api.useUtils();
    const updatePost = api.post.update.useMutation({
        onSuccess: () => {
            void utils.post.invalidate();
            toast.success("Post Updated", {
                description: "The post has been successfully updated.",
            });
            onClose();
        },
        onError: (error) => {
            toast.error("Failed to update post", {
                description: error.message,
            });
        },
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<z.infer<typeof UpdatePostSchema>>({
        resolver: zodResolver(UpdatePostSchema),
        defaultValues: {
            id: post.id,
            title: post.title ?? undefined,
            content: post.content ?? undefined,
            status: post.status,
            scheduledAt: post.scheduledAt ? new Date(post.scheduledAt) : undefined,
            publishedAt: post.publishedAt ? new Date(post.publishedAt) : undefined,
            media: post.media ?? [],
        },
    });

    const status = watch("status");
    const media = watch("media");

    const handleRemoveImage = (imageIndex: number) => {
        setValue(
            "media",
            media.filter((_, idx) => idx !== imageIndex),
            { shouldDirty: true }
        );
    };

    const onSubmit = (data: z.infer<typeof UpdatePostSchema>) => {
        updatePost.mutate({
            ...data,
            scheduledAt: data.status === "SCHEDULED" && data.scheduledAt ? new Date(data.scheduledAt) : null,
        });
    };

    return (
        <form className="px-6 overflow-y-auto" onSubmit={handleSubmit(onSubmit)}>
            <div className="sticky top-0 bg-background -mx-6 px-2 py-2">
                <h3 className="text-lg font-semibold mb-2">Edit Post</h3>
                <p className="text-sm text-muted-foreground mb-4">Make changes to your post content, images, and scheduling.</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-content">Content</Label>
                    <Textarea id="edit-content" className="min-h-[120px]" {...register("content")} defaultValue={post.content ?? ""} />
                    {errors.content && <p className="text-xs text-rose-500 mt-0.5">{errors.content.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label>Images</Label>
                    {media && media.length > 0 ? (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {media.map((m, index) => (
                                    <div key={index} className="relative group">
                                        <img src={m.url} alt={`Post image ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 p-4 border border-dashed rounded-lg text-center">No images attached to this post</div>
                    )}
                    <PostMediaManager
                        onMediaChange={(files) => {
                            setValue(
                                "media",
                                files.map((f) => ({
                                    id: f.id,
                                    url: f.url,
                                    type: f.type,
                                    postId: post.id,
                                })),
                                { shouldDirty: true }
                            );
                        }}
                    />
                </div>
                {status === "SCHEDULED" && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-date">Scheduled Date</Label>
                            <Input id="edit-date" type="datetime-local" {...register("scheduledAt")} />
                            {errors.scheduledAt && <p className="text-xs text-rose-500 mt-0.5">{errors.scheduledAt.message}</p>}
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-2 py-3 px-2 shadow-2xl sticky bottom-0 -mx-6 bg-background">
                    <Button variant="outline" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={updatePost.isPending} isLoading={updatePost.isPending} variant="emerald">
                        Save Changes
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default PostForm;
