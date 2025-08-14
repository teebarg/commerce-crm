"use client";

import { Sparkles } from "lucide-react";
import PostManager from "@/components/PostManager";

export default function ManagePage() {
    return (
        <div className="max-w-7xl px-4 py-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold">Post Manager</h2>
                </div>
                <p className="text-muted-foreground">View, edit, schedule, and manage all your social media posts in one place</p>
            </div>

            <PostManager />
        </div>
    );
}
