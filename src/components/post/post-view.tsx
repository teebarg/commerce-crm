import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark } from "lucide-react";
import { formatDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { EnhancedPlatformPost, EnhancedPost } from "@/schemas/post.schema";
import { Media } from "@prisma/client";

interface PostViewModalProps {
    post: EnhancedPost;
}

const PostView: React.FC<PostViewModalProps> = ({ post }) => {
    const getVariant = (platform: string | undefined): "blue" | "emerald" | "yellow" => {
        const variantMap = {
            instagram: "blue" as const,
            twitter: "emerald" as const,
            facebook: "yellow" as const,
        };
        return variantMap[platform as keyof typeof variantMap] || variantMap.instagram;
    };

    const getStatusVariant = (status: string | undefined): "blue" | "emerald" | "yellow" => {
        const variantMap = {
            published: "emerald" as const,
            scheduled: "blue" as const,
            draft: "yellow" as const,
        };
        return variantMap[status as keyof typeof variantMap] || variantMap.draft;
    };

    const InstagramPreview = () => (
        <Card className="max-w-lg mx-auto bg-white border border-gray-200">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">YB</span>
                        </div>
                        <span className="font-semibold text-sm">brand</span>
                    </div>
                    <MoreHorizontal className="h-5 w-5 text-gray-600" />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {post.media && post.media.length > 0 && (
                    <div className="aspect-square bg-gray-100">
                        <img src={post?.media?.[0]?.url} alt="Post content" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                            <Heart className="h-6 w-6" />
                            <MessageCircle className="h-6 w-6" />
                            <Share className="h-6 w-6" />
                        </div>
                        <Bookmark className="h-6 w-6" />
                    </div>
                    <div className="text-sm">
                        <span className="font-semibold">brand</span> <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const TwitterPreview = () => (
        <Card className="max-w-lg mx-auto bg-white border border-gray-200">
            <CardContent className="p-4">
                <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">YB</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="font-bold text-sm">Your Brand</span>
                            <span className="text-gray-500 text-sm">@brand</span>
                            <span className="text-gray-500 text-sm">·</span>
                            <span className="text-gray-500 text-sm">2h</span>
                        </div>
                        <div className="text-sm mb-3">
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                        </div>
                        {post.media && post.media.length > 0 && (
                            <div className="rounded-2xl overflow-hidden mb-3">
                                <img src={post?.media?.[0]?.url} alt="Post content" className="w-full h-48 object-cover" />
                            </div>
                        )}
                        <div className="flex items-center justify-between text-gray-500 max-w-md">
                            <div className="flex items-center space-x-2">
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-sm">{0}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Share className="h-4 w-4" />
                                <span className="text-sm">{0}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Heart className="h-4 w-4" />
                                <span className="text-sm">{0}</span>
                            </div>
                            <Share className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const FacebookPreview = () => (
        <Card className="max-w-lg mx-auto bg-white border border-gray-200">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">YB</span>
                        </div>
                        <div>
                            <p className="font-bold text-sm">Your Brand</p>
                            <p className="text-gray-500 text-xs">2 hours ago · 🌍</p>
                        </div>
                    </div>
                    <MoreHorizontal className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-sm mb-3">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
                {post.media && post.media.length > 0 && (
                    <div className="rounded-lg overflow-hidden mb-3">
                        <img src={post?.media?.[0]?.url} alt="Post content" className="w-full h-64 object-cover" />
                    </div>
                )}
            </CardContent>
        </Card>
    );

    const renderPlatformPreview = (platformPost: EnhancedPlatformPost) => {
        switch (platformPost.platform.name.toLowerCase()) {
            case "instagram":
                return <InstagramPreview />;
            case "twitter":
                return <TwitterPreview />;
            case "facebook":
                return <FacebookPreview />;
            default:
                return <InstagramPreview />;
        }
    };

    return (
        <div className="overflow-y-auto">
            <div className="flex items-center justify-between py-6 sticky top-0 bg-background px-4">
                <span>Post Details</span>
                <div className="flex items-center space-x-2">
                    {post.platformPosts.map((platformPost: EnhancedPlatformPost, idx: number) => (
                        <Badge key={idx} variant={getVariant(platformPost.platform.name)}>
                            {platformPost.platform.name}
                        </Badge>
                    ))}
                    <Badge variant={getStatusVariant(post.status)}>{post.status}</Badge>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm leading-relaxed">
                                <ReactMarkdown>{post.content}</ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>

                    {post.media && post.media.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Images ({post.media.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3">
                                    {post.media.map((media: Media, index: number) => (
                                        <img
                                            key={index}
                                            src={media.url}
                                            alt={`Post image ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Schedule & Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {post.status === "SCHEDULED" && post.scheduledAt && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Scheduled for:</p>
                                    <p className="text-sm">{formatDate(new Date(post.scheduledAt))}</p>
                                </div>
                            )}
                            {post.status === "PUBLISHED" && post.publishedAt && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Published on:</p>
                                    <p className="text-sm">{formatDate(new Date(post.publishedAt))}</p>
                                </div>
                            )}
                            {post.status === "DRAFT" && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Draft created on:</p>
                                    <p className="text-sm">{formatDate(post.createdAt ? new Date(post.createdAt) : undefined)}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Platform Preview</CardTitle>
                            <p className="text-sm text-gray-500">How this post will look</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {post.platformPosts.map((platformPost: EnhancedPlatformPost, idx: number) => (
                                <div key={idx}>{renderPlatformPreview(platformPost)}</div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PostView;
