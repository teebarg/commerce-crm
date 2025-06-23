import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Media, Platform } from "@prisma/client";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import PostMediaManager from "./post-media-manager";
import { Input } from "@/components/ui/input";
import { EnhancedPost } from "@/schemas/post.schema";

const PostForm: React.FC<{ post: EnhancedPost; onClose: () => void }> = ({ post, onClose }) => {
    const { data: platforms } = api.post.getPlatforms.useQuery();

    const updatePost = api.post.update.useMutation({
        onSuccess: () => {
            toast.success("Post Updated", {
                description: "The post has been successfully updated.",
            });
        },
    });

    const handleSaveEdit = () => {
        if (!post) return;
        updatePost.mutate({ ...post });
    };

    const handleRemoveImage = (imageIndex: number) => {
        //Handle remove image
    };

    const handleAddImage = (imageUrl: string) => {
        //
    };

    return (
        <form className="px-6 overflow-y-auto">
            <div className="sticky top-0 bg-background -mx-6 px-2 py-2">
                <h3 className="text-lg font-semibold mb-2">Edit Post</h3>
                <p className="text-sm text-muted-foreground mb-4">Make changes to your post content, images, and scheduling.</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-content">Content</Label>
                    <Textarea id="edit-content" className="min-h-[120px]" />
                </div>

                {/* Images Section */}
                <div className="space-y-2">
                    <Label>Images</Label>
                    {post.media && post.media.length > 0 ? (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {post.media.map((media: Media, index: number) => (
                                    <div key={index} className="relative group">
                                        <img src={media.url} alt={`Post image ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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

                    <PostMediaManager />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-platform">Platform</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {platforms?.map((platform: Platform, idx: number) => (
                                    <SelectItem key={idx} value={platform.id}>
                                        {platform.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select value={post.status}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DRAFT">Draft</SelectItem>
                                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                <SelectItem value="PUBLISHED">Published</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {post.status === "SCHEDULED" && (
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-date">Scheduled Date</Label>
                            <Input id="edit-date" type="datetime-local" />
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-2 py-3 px-2 shadow-2xl sticky bottom-0 -mx-6 bg-background">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>Save Changes</Button>
                </div>
            </div>
        </form>
    );
};

export default PostForm;
