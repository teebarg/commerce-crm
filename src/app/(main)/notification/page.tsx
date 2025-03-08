"use client";

import { Bell } from "nui-react-icons";
import { NotificationPreview } from "@/components/notification/NotificationPreview";
import { TemplateSelector } from "@/components/notification/TemplateSelector";
import { NotificationForm } from "@/components/notification/NotificationForm";
import { api } from "@/trpc/react";
import { useState } from "react";
import type { NotificationPreview as NotificationPreviewType } from "@/types/generic";

export default function Notification() {
    const [templates] = api.push.templates.useSuspenseQuery();

    const [preview, setPreview] = useState<NotificationPreviewType>({
        title: "",
        body: "",
        icon: "",
    });

    return (
        <div className="bg-content2 w-full min-h-screen pt-8">
            <div>
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight text-default-900 flex items-center">
                            <Bell className="h-8 w-8 mr-3 text-indigo-600" />
                            Push Notification Manager
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto sm:px-6">
                        <div className="px-4 py-8 sm:px-0">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                <div className="space-y-8 col-span-2">
                                    <div className="bg-content1 overflow-hidden shadow rounded-lg">
                                        <div className="px-4 py-5 sm:p-6">
                                            <h2 className="text-lg font-medium text-default-900 mb-4">Compose Notification</h2>
                                            <NotificationForm onPreview={setPreview} />
                                        </div>
                                    </div>

                                    <div className="overflow-hidden shadow rounded-lg bg-content1">
                                        <div className="px-4 py-5 sm:p-6">
                                            <TemplateSelector
                                                templates={templates?.templates}
                                                onSelect={(template) =>
                                                    setPreview({
                                                        title: template.title,
                                                        body: template.body,
                                                        icon: template.icon,
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="overflow-hidden shadow rounded-lg">
                                        <div className="px-4 sm:px-6">
                                            <h2 className="text-lg font-medium text-default-900 mb-4">Preview</h2>
                                            <div className="bg-content1 p-4 rounded-lg">
                                                <NotificationPreview notification={preview} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
