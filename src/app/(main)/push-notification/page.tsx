"use client";

import { Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import PushNotificationManager from "@/components/PushNotificationManager";

export default function PushNotification() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
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

            <div className="container mx-auto px-4 py-6">
                <PushNotificationManager />
            </div>
        </div>
    );
}
