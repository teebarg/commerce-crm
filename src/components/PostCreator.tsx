import { useState } from "react";
import { Sparkles, Image, Calendar, Send, Wand2, Instagram, Twitter, Facebook } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const PostCreator = () => {
    const [postContent, setPostContent] = useState<string | undefined>("");
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
    const [scheduledDate, setScheduledDate] = useState<string>("");
    const [scheduledTime, setScheduledTime] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const platforms = [
        { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-500" },
        { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-blue-500" },
        { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    ];

    const togglePlatform = (platformId: string) => {
        setSelectedPlatforms((prev) => (prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId]));
    };

    const generateAIContent = async () => {
        setIsGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            const aiSuggestions = [
                "🌟 Transform your Monday blues into Monday motivation! Here's how to start your week with purpose and energy. What's your go-to Monday ritual? #MondayMotivation #Productivity",
                "✨ Behind the scenes of creating something amazing! The journey is just as beautiful as the destination. What project are you working on today? #BehindTheScenes #Creative",
                "🚀 Innovation starts with curiosity and a willingness to experiment. Every great idea began as someone's 'what if' moment. What's your next big idea? #Innovation #Entrepreneurship",
            ];
            const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
            setPostContent(randomSuggestion);
            setIsGenerating(false);
            toast.success("AI Content Generated!", {
                description: "Your post has been generated successfully.",
            });
        }, 2000);
    };

    const handleSchedulePost = () => {
        if (!postContent?.trim()) {
            toast.error("Content Required", {
                description: "Please add content to your post before scheduling.",
            });
            return;
        }

        if (selectedPlatforms.length === 0) {
            toast.error("Platform Required", {
                description: "Please select at least one platform to publish to.",
            });
            return;
        }

        toast.success("Post Scheduled!", {
            description: `Your post has been scheduled for ${selectedPlatforms.join(", ")}.`,
        });

        // Reset form
        setPostContent("");
        setScheduledDate("");
        setScheduledTime("");
    };

    const handlePublishNow = () => {
        if (!postContent?.trim()) {
            toast.error("Content Required", {
                description: "Please add content to your post before publishing.",
            });
            return;
        }

        if (selectedPlatforms.length === 0) {
            toast.error("Platform Required", {
                description: "Please select at least one platform to publish to.",
            });
            return;
        }

        toast.success("Post Published!", {
            description: `Your post has been published to ${selectedPlatforms.join(", ")}.`,
        });

        // Reset form
        setPostContent("");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Creation */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            Create New Post
                        </CardTitle>
                        <CardDescription>Write your content or let AI help you create engaging posts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="content">Post Content</Label>
                                <Button variant="outline" size="sm" onClick={generateAIContent} disabled={isGenerating} className="gradient-blue">
                                    <Wand2 className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                                    {isGenerating ? "Generating..." : "AI Generate"}
                                </Button>
                            </div>
                            <Textarea
                                id="content"
                                placeholder="What's on your mind? Share your thoughts, ideas, or let AI help you create something amazing..."
                                value={postContent || ""}
                                onChange={(e) => setPostContent(e.target.value)}
                                className="min-h-[120px] resize-none"
                            />
                            <div className="text-sm text-gray-500">{postContent?.length}/2200 characters</div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <Label>Add Media</Label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-purple-300 transition-colors cursor-pointer">
                                <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Click to upload images or drag and drop</p>
                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Scheduling */}
                <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            Schedule Post
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input id="time" type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Platform Selection */}
                <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Select Platforms</CardTitle>
                        <CardDescription>Choose where to publish your post</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {platforms.map((platform) => {
                            const Icon = platform.icon;
                            const isSelected = selectedPlatforms.includes(platform.id);
                            return (
                                <div
                                    key={platform.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                        isSelected ? "border-purple-300 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    onClick={() => togglePlatform(platform.id)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`h-8 w-8 ${platform.color} rounded-full flex items-center justify-center`}>
                                            <Icon className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="font-medium">{platform.name}</span>
                                    </div>
                                    {isSelected && <Badge className="bg-purple-600">Selected</Badge>}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                    <CardContent className="pt-6 space-y-3">
                        <Button onClick={handlePublishNow} className="w-full gradient-blue" size="lg">
                            <Send className="h-4 w-4 mr-2" />
                            Publish Now
                        </Button>
                        <Button variant="outline" onClick={handleSchedulePost} className="w-full">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Post
                        </Button>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="gradient-blue">
                    <CardHeader>
                        <CardTitle className="text-sm opacity-90">Best Time to Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">3:00 PM - 5:00 PM</div>
                        <p className="text-xs opacity-90">Based on your audience activity</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PostCreator;
