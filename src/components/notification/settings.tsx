"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Bell, Mail, Key } from "lucide-react";

export const NotificationSettings: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl px-4 py-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Configure your notification settings and preferences</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            General Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Application Name</label>
                                <Input defaultValue="My Ecommerce App" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Default Sender Name</label>
                                <Input defaultValue="Ecommerce Team" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Default Message Template</label>
                            <Textarea
                                placeholder="Enter default notification template..."
                                defaultValue="Hi there! We have something exciting to share with you..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Notification Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">Auto-send Welcome Notifications</p>
                                    <p className="text-sm text-muted-foreground">Automatically send welcome messages to new subscribers</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">Rich Notifications</p>
                                    <p className="text-sm text-muted-foreground">Include images and action buttons in notifications</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">Analytics Tracking</p>
                                    <p className="text-sm text-muted-foreground">Track open rates, click rates, and user engagement</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">Delivery Receipts</p>
                                    <p className="text-sm text-muted-foreground">Receive confirmation when notifications are delivered</p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Email Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Email Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">Campaign Reports</p>
                                    <p className="text-sm text-muted-foreground">Receive daily reports about your notification campaigns</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">Error Alerts</p>
                                    <p className="text-sm text-muted-foreground">Get notified when notifications fail to send</p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">Weekly Summary</p>
                                    <p className="text-sm text-muted-foreground">Weekly summary of your notification performance</p>
                                </div>
                                <Switch />
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Notification Email</label>
                                <Input type="email" defaultValue="admin@mystore.com" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* API Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="w-5 h-5" />
                            API Configuration
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                    <p className="font-medium">API Key</p>
                                    <p className="text-sm text-muted-foreground">Used to authenticate API requests</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">Active</Badge>
                                    <Button variant="outline" size="sm">
                                        Regenerate
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Webhook URL</label>
                                <Input placeholder="https://your-app.com/webhook" />
                                <p className="text-xs text-muted-foreground">Receive delivery status updates via webhook</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rate Limit</label>
                                <div className="flex items-center gap-2">
                                    <Input type="number" defaultValue="1000" className="w-32" />
                                    <span className="text-sm text-muted-foreground">requests per hour</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button className="bg-gradient-primary">Save Changes</Button>
                </div>
            </div>
        </div>
    );
};
