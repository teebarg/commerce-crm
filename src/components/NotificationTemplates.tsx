import { useState } from "react";
import { FileText, Plus, Edit, Trash2, Copy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const NotificationTemplates = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    // Mock template data
    const templates = [
        {
            id: "1",
            name: "Welcome New Users",
            title: "Welcome to SocialAI! 🎉",
            message: "Thanks for joining us! Get started by creating your first post.",
            category: "onboarding",
            usageCount: 234,
            isFavorite: true,
            createdAt: "2024-01-15",
        },
        {
            id: "2",
            name: "Post Published",
            title: "Your post is now live! 📱",
            message: "Your social media post has been successfully published across all platforms.",
            category: "engagement",
            usageCount: 567,
            isFavorite: false,
            createdAt: "2024-01-18",
        },
        {
            id: "3",
            name: "Weekly Analytics",
            title: "Your weekly performance report 📊",
            message: "See how your content performed this week. View your analytics dashboard.",
            category: "analytics",
            usageCount: 89,
            isFavorite: true,
            createdAt: "2024-01-20",
        },
        {
            id: "4",
            name: "Scheduled Post Reminder",
            title: "Don't forget your scheduled post! ⏰",
            message: "You have a post scheduled to go live in 1 hour. Make any last-minute changes now.",
            category: "reminders",
            usageCount: 156,
            isFavorite: false,
            createdAt: "2024-01-22",
        },
    ];

    const categories = [
        { id: "all", name: "All Templates", count: templates.length },
        { id: "onboarding", name: "Onboarding", count: templates.filter((t) => t.category === "onboarding").length },
        { id: "engagement", name: "Engagement", count: templates.filter((t) => t.category === "engagement").length },
        { id: "analytics", name: "Analytics", count: templates.filter((t) => t.category === "analytics").length },
        { id: "reminders", name: "Reminders", count: templates.filter((t) => t.category === "reminders").length },
    ];

    const filteredTemplates = templates.filter((template) => {
        const matchesSearch =
            template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.message.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleUseTemplate = (template: any) => {
        console.log("Using template:", template);
        toast.success("Template Applied", {
            description: `"${template.name}" template has been loaded in the composer.`,
        });
    };

    const handleCopyTemplate = (template: any) => {
        console.log("Copying template:", template);
        toast.success("Template Copied", {
            description: `"${template.name}" template has been duplicated.`,
        });
    };

    const handleDeleteTemplate = (templateId: string) => {
        console.log("Deleting template:", templateId);
        toast.error("Template Deleted", {
            description: "The template has been permanently deleted.",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold">Notification Templates</h3>
                    <p className="text-sm text-gray-600">Create and manage reusable notification templates</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            New Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Template</DialogTitle>
                            <DialogDescription>Create a new notification template for future use.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Template Name</label>
                                <Input placeholder="Enter template name" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Title</label>
                                <Input placeholder="Notification title" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Message</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none"
                                    rows={3}
                                    placeholder="Notification message"
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button className="flex-1">Create Template</Button>
                                <Button variant="outline" className="flex-1">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Categories */}
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-64">
                    <div className="space-y-4">
                        <Input placeholder="Search templates..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm">Categories</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
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

                {/* Templates Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {filteredTemplates.map((template) => (
                            <Card key={template.id} className="relative">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <CardTitle className="text-base">{template.name}</CardTitle>
                                            {template.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {template.category}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-medium text-sm mb-1">{template.title}</h4>
                                        <p className="text-sm text-gray-600">{template.message}</p>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>Used {template.usageCount} times</span>
                                        <span>Created {template.createdAt}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button size="sm" className="flex-1" onClick={() => handleUseTemplate(template)}>
                                            Use Template
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => handleCopyTemplate(template)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteTemplate(template.id)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm ? "Try adjusting your search terms." : "Create your first notification template to get started."}
                            </p>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Template
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Create New Template</DialogTitle>
                                        <DialogDescription>Create a new notification template for future use.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-4">
                                        <Input placeholder="Template name" />
                                        <Input placeholder="Notification title" />
                                        <textarea
                                            className="w-full px-3 py-2 border border-input rounded-md text-sm resize-none"
                                            rows={3}
                                            placeholder="Notification message"
                                        />
                                        <div className="flex gap-2">
                                            <Button className="flex-1">Create</Button>
                                            <Button variant="outline" className="flex-1">
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationTemplates;
