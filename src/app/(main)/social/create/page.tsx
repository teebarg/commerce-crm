"use client";

import { Sparkles } from "lucide-react";
import PostCreator from "@/components/PostCreator";

export default function CreatePage() {
    return (
        <div className="max-w-6xl px-4 py-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold">Post Creator</h2>
                </div>
                <p className="text-muted-foreground">Use AI-powered tools to create engaging social media posts for multiple platforms</p>
            </div>

            <PostCreator />
        </div>
    );
}
