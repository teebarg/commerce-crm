import { useState } from "react";
import { FileText, Clock, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Post } from "@prisma/client";
import { api } from "@/trpc/react";
import PostItem from "./post/post-item";
import { EnhancedPost, EnhancedPlatformPost } from "@/schemas/post.schema";

const PostManager: React.FC = () => {
    const { data } = api.post.all.useQuery({});
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterPlatform, setFilterPlatform] = useState<string>("all");

    const posts = data?.posts;

    const filteredPosts = posts?.filter((post: EnhancedPost) => {
        const statusMatch = filterStatus === "all" || post.status === filterStatus;
        const platformMatch = filterPlatform === "all" || post.platformPosts.some((pp: EnhancedPlatformPost) => pp.platform.name.toLowerCase() === filterPlatform);
        return statusMatch && platformMatch;
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Total Posts</CardTitle>
                        <FileText className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{posts?.length}</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Scheduled</CardTitle>
                        <Clock className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{posts?.filter((p: Post) => p.status === "SCHEDULED").length}</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Published</CardTitle>
                        <Users className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{posts?.filter((p: Post) => p.status === "PUBLISHED").length}</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Drafts</CardTitle>
                        <BarChart3 className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{posts?.filter((p: Post) => p.status === "DRAFT").length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="scheduled">Scheduled</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Platform</Label>
                            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Platforms</SelectItem>
                                    <SelectItem value="instagram">Instagram</SelectItem>
                                    <SelectItem value="twitter">Twitter</SelectItem>
                                    <SelectItem value="facebook">Facebook</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                        Posts Management
                    </CardTitle>
                    <CardDescription>Manage your social media posts</CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredPosts?.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                            <p className="text-gray-500">No posts match your current filters.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Content</TableHead>
                                        <TableHead>Images</TableHead>
                                        <TableHead>Platform</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Schedule/Published</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>{filteredPosts?.map((post: EnhancedPost, idx: number) => <PostItem key={idx} post={post} />)}</TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PostManager;
