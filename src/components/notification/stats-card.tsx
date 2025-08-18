import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "positive" | "negative" | "neutral";
    icon: LucideIcon;
    description?: string;
}

export function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, description }: StatsCardProps) {
    const changeColor = {
        positive: "text-success",
        negative: "text-destructive",
        neutral: "text-muted-foreground",
    }[changeType];

    return (
        <Card className="shadow-soft transition-smooth hover:shadow-medium">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center gap-2 text-xs">
                    {change && <span className={changeColor}>{change}</span>}
                    {description && <span className="text-muted-foreground">{description}</span>}
                </div>
            </CardContent>
        </Card>
    );
}
