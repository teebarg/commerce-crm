"use client";

import { useState } from "react";
import { Calendar, PlusCircle, BarChart3, Settings, Sparkles, Clock, Users, TrendingUp, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PostCreator from "@/components/PostCreator";
import ContentCalendar from "@/components/ContentCalendar";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import PushNotificationManager from "@/components/PushNotificationManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PushNotification() {
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
                    <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 backdrop-blur-md">
                        <TabsTrigger value="push" className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            <span className="hidden sm:inline">Push</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Push Notifications */}
                    <TabsContent value="push">
                        <PushNotificationManager />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};
