"use client";

import { useState } from "react";
import { Calendar, PlusCircle, BarChart3, Settings, Sparkles, Clock, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PostCreator from "@/components/PostCreator";
import ContentCalendar from "@/components/ContentCalendar";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                    SocialAI
                                </h1>
                                <p className="text-sm text-gray-500">AI-Powered Social Media Manager</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <div className="container mx-auto px-4 py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-md">
                        <TabsTrigger value="dashboard" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </TabsTrigger>
                        <TabsTrigger value="create" className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            <span className="hidden sm:inline">Create</span>
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span className="hidden sm:inline">Calendar</span>
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span className="hidden sm:inline">Analytics</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Dashboard Overview */}
                    <TabsContent value="dashboard" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium opacity-90">Total Posts</CardTitle>
                                    <PlusCircle className="h-4 w-4 opacity-90" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">156</div>
                                    <p className="text-xs opacity-90">+12% from last month</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium opacity-90">Scheduled</CardTitle>
                                    <Clock className="h-4 w-4 opacity-90" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">23</div>
                                    <p className="text-xs opacity-90">Next: Today 3:00 PM</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium opacity-90">Engagement</CardTitle>
                                    <Users className="h-4 w-4 opacity-90" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">12.5K</div>
                                    <p className="text-xs opacity-90">+8.2% this week</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium opacity-90">Reach</CardTitle>
                                    <TrendingUp className="h-4 w-4 opacity-90" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">45.2K</div>
                                    <p className="text-xs opacity-90">+15% growth</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Activity */}
                        <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-purple-600" />
                                    Recent Activity
                                </CardTitle>
                                <CardDescription>Your latest social media activities</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                                            <PlusCircle className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium">New post published</p>
                                            <p className="text-sm text-gray-500">Instagram • 2 hours ago</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                        Published
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                                            <Clock className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Post scheduled</p>
                                            <p className="text-sm text-gray-500">Twitter • Tomorrow 9:00 AM</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                        Scheduled
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Post Creation */}
                    <TabsContent value="create">
                        <PostCreator />
                    </TabsContent>

                    {/* Calendar View */}
                    <TabsContent value="calendar">
                        <ContentCalendar />
                    </TabsContent>

                    {/* Analytics */}
                    <TabsContent value="analytics">
                        <AnalyticsDashboard />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Index;
