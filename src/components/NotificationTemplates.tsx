"use client";

import { useState } from "react";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TemplateForm } from "./notification/template-form";
import { useOverlayTriggerState } from "@react-stately/overlays";
import Overlay from "./overlay";
import { api } from "@/trpc/react";
import { type NotificationTemplate } from "@prisma/client";
import NotificationTemplateItem from "./notification/notification-template-item";

const NotificationTemplates: React.FC = () => {
    const [res] = api.push.templates.useSuspenseQuery();
    const templates = res.templates;
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const createState = useOverlayTriggerState({});

    const categories = [
        { id: "all", name: "All Templates", count: templates.length },
        { id: "GENERIC", name: "Generic", count: templates.filter((t) => t.category === "GENERIC").length },
        { id: "ONBOARDING", name: "Onboarding", count: templates.filter((t) => t.category === "ONBOARDING").length },
        { id: "ENGAGEMENT", name: "Engagement", count: templates.filter((t) => t.category === "ENGAGEMENT").length },
        { id: "ANALYTICS", name: "Analytics", count: templates.filter((t) => t.category === "ANALYTICS").length },
        { id: "REMINDER", name: "Reminders", count: templates.filter((t) => t.category === "REMINDER").length },
    ];

    const filteredTemplates = templates.filter((template: NotificationTemplate) => {
        const matchesSearch =
            template.title.toLowerCase().includes(searchTerm.toLowerCase()) || template.body.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6 px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Notification Templates</h3>
                    <p className="text-sm text-muted-foreground">Create and manage reusable notification templates</p>
                </div>
                <Overlay
                    open={createState.isOpen}
                    title="Create New Template"
                    trigger={
                        <Button className="gradient-blue">
                            <Plus className="h-4 w-4 mr-2" />
                            New Template
                        </Button>
                    }
                    onOpenChange={createState.setOpen}
                >
                    <TemplateForm onClose={createState.close} mode="create" />
                </Overlay>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-64">
                    <div className="space-y-4">
                        <Input placeholder="Search templates..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Categories</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {categories.map((category, idx: number) => (
                                    <Button
                                        key={idx}
                                        variant={selectedCategory === category.id ? "default" : "ghost"}
                                        className="w-full justify-between"
                                        size="sm"
                                        onClick={() => setSelectedCategory(category.id)}
                                    >
                                        <span>{category.name}</span>
                                        <Badge variant="secondary" className="ml-2">
                                            {category.count}
                                        </Badge>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <div className="flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredTemplates.map((template: NotificationTemplate, idx: number) => (
                            <NotificationTemplateItem key={idx} template={template} />
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No templates found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm ? "Try adjusting your search terms." : "Create your first notification template to get started."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationTemplates;
