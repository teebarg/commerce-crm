import { BarChart3, TrendingUp, Users, Eye, Heart, MessageCircle, Share } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const AnalyticsDashboard = () => {
    const analyticsData = {
        totalReach: 45200,
        totalEngagement: 12500,
        totalFollowers: 8900,
        totalPosts: 156,
        growthRate: 15.2,
        engagementRate: 3.8,
    };

    const platformStats = [
        {
            platform: "Instagram",
            followers: "5.2K",
            engagement: "4.2%",
            posts: 48,
            color: "bg-pink-500",
            growth: "+12%",
        },
        {
            platform: "Twitter",
            followers: "2.1K",
            engagement: "3.8%",
            posts: 72,
            color: "bg-blue-500",
            growth: "+8%",
        },
        {
            platform: "Facebook",
            followers: "1.6K",
            engagement: "2.9%",
            posts: 36,
            color: "bg-blue-600",
            growth: "+15%",
        },
    ];

    const topPosts = [
        {
            id: 1,
            content: "Monday motivation: Start your week strong! 💪",
            platform: "Instagram",
            likes: 342,
            comments: 28,
            shares: 15,
            date: "2024-01-15",
        },
        {
            id: 2,
            content: "Behind the scenes of our latest project...",
            platform: "Twitter",
            likes: 156,
            comments: 42,
            shares: 23,
            date: "2024-01-16",
        },
        {
            id: 3,
            content: "Sharing insights from our recent team meeting...",
            platform: "Facebook",
            likes: 89,
            comments: 12,
            shares: 7,
            date: "2024-01-17",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Total Reach</CardTitle>
                        <Eye className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.totalReach.toLocaleString()}</div>
                        <p className="text-xs opacity-90">+{analyticsData.growthRate}% from last month</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Engagement</CardTitle>
                        <Heart className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.totalEngagement.toLocaleString()}</div>
                        <p className="text-xs opacity-90">{analyticsData.engagementRate}% rate</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Followers</CardTitle>
                        <Users className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.totalFollowers.toLocaleString()}</div>
                        <p className="text-xs opacity-90">Across all platforms</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Total Posts</CardTitle>
                        <BarChart3 className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.totalPosts}</div>
                        <p className="text-xs opacity-90">This month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Performance */}
                <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                            Platform Performance
                        </CardTitle>
                        <CardDescription>Compare performance across platforms</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {platformStats.map((stat, index) => (
                            <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className={`h-8 w-8 ${stat.color} rounded-full flex items-center justify-center`}>
                                            <BarChart3 className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="font-semibold">{stat.platform}</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                        {stat.growth}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Followers</p>
                                        <p className="font-semibold">{stat.followers}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Engagement</p>
                                        <p className="font-semibold">{stat.engagement}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Posts</p>
                                        <p className="font-semibold">{stat.posts}</p>
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span>Engagement Rate</span>
                                        <span>{stat.engagement}</span>
                                    </div>
                                    <Progress value={parseFloat(stat.engagement)} className="h-2" />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Top Performing Posts */}
                <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Top Performing Posts
                        </CardTitle>
                        <CardDescription>Your most engaging content this week</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {topPosts.map((post, index) => (
                            <div key={post.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                        #{index + 1} {post.platform}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{post.date}</span>
                                </div>

                                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{post.content}</p>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1">
                                            <Heart className="h-3 w-3 text-red-500" />
                                            <span>{post.likes}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <MessageCircle className="h-3 w-3 text-blue-500" />
                                            <span>{post.comments}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Share className="h-3 w-3 text-green-500" />
                                            <span>{post.shares}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">{post.likes + post.comments + post.shares} total interactions</div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Engagement Insights */}
            <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                        Engagement Insights
                    </CardTitle>
                    <CardDescription>Understanding your audience behavior</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600 mb-2">3:00 PM</div>
                            <p className="text-sm text-gray-600">Best time to post</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600 mb-2">Tuesday</div>
                            <p className="text-sm text-gray-600">Most active day</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-r from-green-50 to-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600 mb-2">4.2%</div>
                            <p className="text-sm text-gray-600">Avg. engagement rate</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsDashboard;
