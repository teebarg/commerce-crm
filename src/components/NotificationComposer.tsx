import { useState } from "react";
import { Send, Link, Clock, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/trpc/react";

const NotificationComposer = () => {
    const utils = api.useUtils();
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [actionUrl, setActionUrl] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [scheduleEnabled, setScheduleEnabled] = useState(false);
    const [scheduleTime, setScheduleTime] = useState<string>("");
    const [targetAll, setTargetAll] = useState(true);

    const mutation = api.push.createNotification.useMutation({
        onSuccess: async () => {
            toast.success("Successful!", {
                description: "Push notification sent successfully.",
            });
            await utils.push.invalidate();

            setTitle("");
            setMessage("");
            setActionUrl("");
            setIconUrl("");
            setScheduleEnabled(false);
            setScheduleTime("");
            setTargetAll(true);
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const handleSendNotification = async () => {
        if (!title || !message) {
            toast.error("Missing Information", {
                description: "Please provide both title and message for the notification.",
            });
            return;
        }

        mutation.mutate({
            title: `${iconUrl} ${title}`,
            body: message,
            scheduledAt: scheduleEnabled ? new Date(scheduleTime) : undefined,
            data: { actionUrl },
            imageUrl: iconUrl,
        });
    };

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                        <Sparkles className="h-5 w-5" />
                        Notification Preview
                    </CardTitle>
                    <CardDescription>See how your notification will appear to users</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-white rounded-lg p-4 shadow-sm border">
                        <div className="flex items-start gap-3">
                            {iconUrl && (
                                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <img src={iconUrl} alt="Icon" className="w-6 h-6 rounded" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{title || "Your notification title"}</h4>
                                <p className="text-sm text-gray-600 mt-1">{message || "Your notification message will appear here"}</p>
                                {actionUrl && (
                                    <div className="mt-2">
                                        <Badge variant="outline" className="text-xs">
                                            <Link className="h-3 w-3 mr-1" />
                                            Action Available
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Compose Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Notification Content</CardTitle>
                        <CardDescription>Create your push notification content</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Title *</label>
                            <Input placeholder="Enter notification title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={50} />
                            <p className="text-xs text-gray-500 mt-1">{title.length}/50 characters</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Message *</label>
                            <textarea
                                className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none"
                                rows={4}
                                placeholder="Enter your notification message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                maxLength={200}
                            />
                            <p className="text-xs text-gray-500 mt-1">{message.length}/200 characters</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Action URL</label>
                            <Input placeholder="https://example.com (optional)" value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Icon URL</label>
                            <Input
                                placeholder="https://example.com/icon.png (optional)"
                                value={iconUrl}
                                onChange={(e) => setIconUrl(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Options</CardTitle>
                        <CardDescription>Configure when and how to send</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium">Schedule for later</span>
                            </div>
                            <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
                        </div>

                        {scheduleEnabled && (
                            <div>
                                <label className="text-sm font-medium mb-2 block">Schedule Time</label>
                                <Input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium">Send to all subscribers</span>
                            </div>
                            <Switch checked={targetAll} onCheckedChange={setTargetAll} />
                        </div>

                        {!targetAll && (
                            <div>
                                <label className="text-sm font-medium mb-2 block">Target Segments</label>
                                <div className="space-y-2">
                                    <Badge variant="secondary" className="mr-2">
                                        Active Users
                                    </Badge>
                                    <Badge variant="secondary" className="mr-2">
                                        New Subscribers
                                    </Badge>
                                    <Badge variant="secondary">Engaged Users</Badge>
                                </div>
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <div className="text-sm text-gray-600 mb-4">
                                <p className="flex items-center gap-2 mb-1">
                                    <Users className="h-4 w-4" />
                                    Estimated reach: {targetAll ? "2,847" : "1,423"} subscribers
                                </p>
                                <p className="text-xs text-gray-500">Based on current active subscribers</p>
                            </div>

                            <Button
                                isLoading={mutation.isPending}
                                onClick={handleSendNotification}
                                disabled={mutation.isPending || !title || !message}
                                className="w-full gradient-blue"
                            >
                                {scheduleEnabled ? (
                                    <>
                                        <Clock className="h-4 w-4 mr-2" />
                                        Schedule Notification
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Now
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default NotificationComposer;
