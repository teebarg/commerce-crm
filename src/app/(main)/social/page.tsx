"use client";

import { PlusCircle, Sparkles, Clock, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
    return (
        <div className="px-4 py-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">SocialAI</h1>
                    <p className="text-sm text-gray-500">AI-Powered Social Media Manager</p>
                </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-default-100 backdrop-blur-md border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                        <PlusCircle className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card className="bg-default-100 backdrop-blur-md border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                        <Clock className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-xs text-muted-foreground">Next: Today 3:00 PM</p>
                    </CardContent>
                </Card>

                <Card className="bg-default-100 backdrop-blur-md border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                        <Users className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12.5K</div>
                        <p className="text-xs text-muted-foreground">+8.2% this week</p>
                    </CardContent>
                </Card>

                <Card className="bg-default-100 backdrop-blur-md border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reach</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45.2K</div>
                        <p className="text-xs text-muted-foreground">+15% growth</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-default-100 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest social media activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-default rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                                <PlusCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="font-medium">New post published</p>
                                <p className="text-sm text-default-500">Instagram • 2 hours ago</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Published
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-default rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Clock className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <p className="font-medium">Post scheduled</p>
                                <p className="text-sm text-default-500">Twitter • Tomorrow 9:00 AM</p>
                            </div>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Scheduled
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Index;
