/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import React, { useState } from "react";
import { Send, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { type NotificationTemplate } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Smile } from "lucide-react";
import { EMOJIS } from "@/utils/emoji";
import { uploadMediaToSupabase } from "@/lib/supabase";
import Image from "next/image";

interface UseTemplateFormProps {
    template: NotificationTemplate;
    onClose: () => void;
}

const UseTemplateForm: React.FC<UseTemplateFormProps> = ({ template, onClose }) => {
    const utils = api.useUtils();
    const [title, setTitle] = useState<string>(template.title);
    const [body, setBody] = useState<string>(template.body);
    const [actionUrl, setActionUrl] = useState<string>((template.data as any)?.actionUrl ?? "");
    const [imageUrl, setImageUrl] = useState<string>((template as any)?.imageUrl ?? "");
    const [scheduleEnabled, setScheduleEnabled] = useState<boolean>(false);
    const [sendNowEnabled, setSendNowEnabled] = useState<boolean>(true);
    const [scheduleTime, setScheduleTime] = useState<string>("");

    const mutation = api.push.createNotification.useMutation({
        onSuccess: async () => {
            toast.success("Notification sent successfully!", {
                description: "Your notification has been delivered to subscribers.",
            });
            await utils.push.invalidate();
            onClose();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const handleSendNotification = async () => {
        if (!title || !body) {
            toast.error("Missing Information", {
                description: "Please provide both title and body for the notification.",
            });
            return;
        }

        mutation.mutate({
            title,
            body,
            scheduledAt: scheduleEnabled ? new Date(scheduleTime) : undefined,
            status: scheduleEnabled ? "SCHEDULED" : sendNowEnabled ? "PUBLISHED" : "DRAFT",
            data: { actionUrl },
            imageUrl: imageUrl || undefined,
        });
    };

    return (
        <div className="space-y-6">
            {/* Template Preview */}
            <Card className="bg-gradient-to-r from-purple-300 to-blue-400">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                        <Users className="h-5 w-5" />
                        Template Preview
                    </CardTitle>
                    <CardDescription className="text-purple-500">
                        Based on: {template.code} - {template.category}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{title || "Your notification title"}</h4>
                                <p className="text-sm text-gray-600 mt-1">{body || "Your notification message will appear here"}</p>
                                {actionUrl && (
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {actionUrl}
                                        </span>
                                    </div>
                                )}
                                {imageUrl && (
                                    <div className="mt-3">
                                        <Image src={imageUrl} alt="notification" className="rounded-md border" height={100} width={100} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Customization Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Customize Content</CardTitle>
                        <CardDescription>Modify the template for your notification</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Title *</label>
                            <Input
                                placeholder="Enter notification title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                maxLength={50}
                                endContent={
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button size="icon" variant="ghost" aria-label="Insert emoji">
                                                <Smile className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {EMOJIS.map((emoji) => (
                                                <DropdownMenuItem key={emoji} onClick={() => setTitle((t) => `${t}${emoji}`)}>
                                                    {emoji}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                }
                            />
                            <p className="text-xs text-gray-500 mt-1">{title.length}/50 characters</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium block">Message *</label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button size="icon" variant="ghost" aria-label="Insert emoji">
                                            <Smile className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {EMOJIS.map((emoji) => (
                                            <DropdownMenuItem key={emoji} onClick={() => setBody((m) => `${m}${emoji}`)}>
                                                {emoji}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <textarea
                                className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none"
                                rows={4}
                                placeholder="Enter your notification message"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                maxLength={200}
                            />
                            <p className="text-xs text-gray-500 mt-1">{body.length}/200 characters</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Action URL</label>
                            <Input placeholder="https://example.com (optional)" value={actionUrl} onChange={(e) => setActionUrl(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Image URL</label>
                            <Input
                                placeholder="https://example.com/image.png (optional)"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Or Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                        const url = await uploadMediaToSupabase(file, "notifications");
                                        setImageUrl(url);
                                    } catch (err) {
                                        // no-op toast here to keep dependency minimal; composer shows toast
                                        console.error("Upload failed", err);
                                    }
                                }}
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
                                <Send className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium">Send Now</span>
                            </div>
                            <Switch checked={sendNowEnabled} onCheckedChange={setSendNowEnabled} />
                        </div>
                        {!sendNowEnabled && (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium">Schedule for later</span>
                                </div>
                                <Switch checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
                            </div>
                        )}

                        {!sendNowEnabled && scheduleEnabled && (
                            <div>
                                <label className="text-sm font-medium mb-2 block">Schedule Time</label>
                                <Input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                            </div>
                        )}

                        <div className="pt-4 border-t">
                            <div className="text-sm text-gray-600 mb-4">
                                <p className="flex items-center gap-2 mb-1">
                                    <Users className="h-4 w-4" />
                                    Estimated reach: All subscribers
                                </p>
                                <p className="text-xs text-gray-500">Based on current active subscribers</p>
                            </div>

                            <Button
                                isLoading={mutation.isPending}
                                onClick={handleSendNotification}
                                disabled={mutation.isPending || !title || !body}
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
                                        {sendNowEnabled ? "Send Now" : "Create Draft"}
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

export default UseTemplateForm;
