"use client";

import { Sparkles } from "lucide-react";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

export default function AnalyticsPage() {
    return (
        <div className="max-w-7xl px-4 py-6">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
                </div>
                <p className="text-muted-foreground">Comprehensive analytics and insights to optimize your social media strategy</p>
            </div>

            <AnalyticsDashboard />
        </div>
    );
}
