import { useState } from "react";
import { Bell, Send, Users, BarChart3, FileText, Settings, History } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NotificationComposer from "./NotificationComposer";
import SubscriberManager from "./SubscriberManager";
import NotificationTemplates from "./NotificationTemplates";

const PushNotificationManager = () => {
    const [activeSubTab, setActiveSubTab] = useState("compose");

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Active Subscribers</CardTitle>
                        <Users className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2,847</div>
                        <p className="text-xs opacity-90">+127 this week</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Sent Today</CardTitle>
                        <Send className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs opacity-90">12 campaigns active</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Delivery Rate</CardTitle>
                        <BarChart3 className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">98.5%</div>
                        <p className="text-xs opacity-90">+2.1% improvement</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Click Rate</CardTitle>
                        <Bell className="h-4 w-4 opacity-90" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12.4%</div>
                        <p className="text-xs opacity-90">Above industry avg</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-purple-600" />
                        Push Notification Manager
                    </CardTitle>
                    <CardDescription>Manage your VAPID push notifications and subscribers</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4 mb-6">
                            <TabsTrigger value="compose" className="flex items-center gap-2">
                                <Send className="h-4 w-4" />
                                <span className="hidden sm:inline">Compose</span>
                            </TabsTrigger>
                            <TabsTrigger value="subscribers" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className="hidden sm:inline">Subscribers</span>
                            </TabsTrigger>
                            <TabsTrigger value="templates" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="hidden sm:inline">Templates</span>
                            </TabsTrigger>
                            <TabsTrigger value="history" className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                <span className="hidden sm:inline">History</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="compose">
                            <NotificationComposer />
                        </TabsContent>

                        <TabsContent value="subscribers">
                            <SubscriberManager />
                        </TabsContent>

                        <TabsContent value="templates">
                            <NotificationTemplates />
                        </TabsContent>

                        <TabsContent value="history">
              <NotificationHistory />
            </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default PushNotificationManager;
