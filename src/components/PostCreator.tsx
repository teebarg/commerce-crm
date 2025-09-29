"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Image as ImageIcon, Send, Wand2, Instagram, Twitter, Facebook, Clock, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import SocialImageManager from "./media-post/social-image-manager";
import { EnhancedCreatePostInput, type AIGenerationInput } from "@/schemas/post.schema";
import type { z } from "zod";
import { Switch } from "@/components/ui/switch";

interface MediaFile {
    id: string;
    file: File;
    url: string;
    type: "IMAGE" | "VIDEO" | "GIF";
    name: string;
}

const PostCreator = () => {
    const utils = api.useUtils();
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [aiBusinessName, setAiBusinessName] = useState<string>("Revoque");
    const [aiProductService, setAiProductService] = useState<string>("thrift store");
    const [aiTargetAudience, setAiTargetAudience] = useState<string>("people looking for unique and affordable items");
    const [aiSpecialOffer, setAiSpecialOffer] = useState<string>("quality products at great prices");
    const [aiTone, setAiTone] = useState<string>("friendly");
    const [aiIndustry, setAiIndustry] = useState<string>("ecommerce");
    const [scheduleTime, setScheduleTime] = useState<string>("");
    const [postLater, setPostLater] = useState(false);
    const form = useForm<z.infer<typeof EnhancedCreatePostInput>>({
        resolver: zodResolver(EnhancedCreatePostInput),
        defaultValues: {
            content: "",
            platforms: ["instagram"],
            scheduledAt: new Date(),
            status: "DRAFT",
        },
    });

    const {
        watch,
        setValue,
        handleSubmit,
        formState: { errors },
    } = form;
    const selectedPlatforms = watch("platforms");
    const postContent = watch("content");

    // Mutations
    const createPostMutation = api.post.createEnhancedPost.useMutation({
        onSuccess: async () => {
            toast.success("Post created successfully!");
            await utils.post.invalidate();
 
            form.reset();
            setMediaFiles([]);
            setScheduleTime("");
            setAiProductService("thrift store");
            setAiTargetAudience("people looking for unique and affordable items");
            setAiSpecialOffer("quality products at great prices");
            setAiTone("friendly");
            setAiIndustry("ecommerce");
        },
        onError: (error) => {
            toast.error(`Error creating post: ${error.message}`);
        },
    });

    const generateAIMutation = api.post.generateAIContent.useMutation({
        onSuccess: (data) => {
            setValue("content", data.content!);
            toast.success("AI Content Generated!", {
                description: "Your post has been generated successfully.",
            });
        },
        onError: (error) => {
            toast.error(`AI generation failed: ${error.message}`);
        },
    });

    const { isPending: isGenerating } = generateAIMutation;

    const platformOptions = [
        { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-500" },
        { id: "twitter", name: "Twitter", icon: Twitter, color: "bg-blue-500" },
        { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    ];

    const togglePlatform = (platformId: string) => {
        const current = selectedPlatforms || [];
        const updated = current.includes(platformId) ? current.filter((id) => id !== platformId) : [...current, platformId];
        setValue("platforms", updated);
    };

    const generateAIContent = async () => {
        if (!selectedPlatforms || selectedPlatforms.length === 0) {
            toast.error("Please select at least one platform first");
            return;
        }
        const input: AIGenerationInput = {
            platforms: selectedPlatforms,
            tone: aiTone as any,
            industry: aiIndustry,
            businessName: aiBusinessName,
            productService: aiProductService,
            targetAudience: aiTargetAudience,
            specialOffer: aiSpecialOffer,
        };
        await generateAIMutation.mutateAsync(input);
    };

    const handleMediaChange = (media: MediaFile[]) => {
        setMediaFiles(media);
    };

    const onSubmit = async (data: z.infer<typeof EnhancedCreatePostInput>) => {
        try {
            const media = mediaFiles.map((file) => ({
                url: file.url,
                type: file.type,
            }));

            await createPostMutation.mutateAsync({
                ...data,
                media: media.length > 0 ? media : undefined,
            });
        } catch (error) {
            console.error("Error submitting post:", error);
        }
    };

    const handleCreateDraft = async () => {
        setValue("status", "DRAFT");
        await handleSubmit(onSubmit)();
    };

    const handleSchedulePost = async () => {
        if (!scheduleTime) {
            toast.error("Please select both date and time for scheduling");
            return;
        }
        setValue("status", "SCHEDULED");
        setValue("scheduledAt", new Date(scheduleTime));
        await handleSubmit(onSubmit)();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-default-100 backdrop-blur-md border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-600" />
                            Create New Post
                        </CardTitle>
                        <CardDescription>Write your content or let AI help you create engaging posts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3 p-4 bg-card rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <Wand2 className="h-4 w-4 text-purple-600" />
                                <Label className="font-medium">AI Content Generator</Label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Input
                                    label="Business Name"
                                    id="ai-business-name"
                                    placeholder="e.g., My Business"
                                    value={aiBusinessName}
                                    onChange={(e) => setAiBusinessName(e.target.value)}
                                />
                                <Input
                                    label="Product/Service"
                                    id="ai-product-service"
                                    placeholder="e.g., Products and Services"
                                    value={aiProductService}
                                    onChange={(e) => setAiProductService(e.target.value)}
                                />
                                <Input
                                    label="Target Audience"
                                    id="ai-target-audience"
                                    placeholder="e.g., General Consumers"
                                    value={aiTargetAudience}
                                    onChange={(e) => setAiTargetAudience(e.target.value)}
                                />
                                <Input
                                    label="Special Offer"
                                    id="ai-special-offer"
                                    placeholder="e.g., Quality Products at Great Prices"
                                    value={aiSpecialOffer}
                                    onChange={(e) => setAiSpecialOffer(e.target.value)}
                                />

                                <div className="space-y-2">
                                    <Label htmlFor="ai-tone" className="text-sm mb-0.5 text-default-500">
                                        Tone
                                    </Label>
                                    <Select value={aiTone} onValueChange={setAiTone}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="friendly">Friendly</SelectItem>
                                            <SelectItem value="professional">Professional</SelectItem>
                                            <SelectItem value="casual">Casual</SelectItem>
                                            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                                            <SelectItem value="formal">Formal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Input
                                    id="ai-industry"
                                    label="Industry"
                                    placeholder="e.g., Technology, Fitness"
                                    value={aiIndustry}
                                    onChange={(e) => setAiIndustry(e.target.value)}
                                />
                            </div>

                            <Button
                                onClick={generateAIContent}
                                disabled={isGenerating || !selectedPlatforms?.length}
                                className="w-full gradient-blue"
                            >
                                <Wand2 className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                                {isGenerating ? "Generating..." : "Generate AI Content"}
                            </Button>
                        </div>

                        <Separator />

                        {/* Content Editor */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="content">Post Content</Label>
                                <Badge variant="secondary">{postContent?.length || 0}/2200 characters</Badge>
                            </div>
                            <Textarea
                                id="content"
                                placeholder="What's on your mind? Share your thoughts, ideas, or let AI help you create something amazing..."
                                {...form.register("content")}
                                className="min-h-[250px]!"
                            />
                            {errors.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
                        </div>

                        <Separator />

                        {/* Media Upload */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Upload className="h-4 w-4 text-gray-600" />
                                <Label>Add Media</Label>
                            </div>
                            <SocialImageManager onMediaChange={handleMediaChange} maxFiles={5} maxSize={10} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <Card className="bg-default-100 border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>Select Platforms</CardTitle>
                        <CardDescription>Choose where to publish your post</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {platformOptions.map((platform, idx: number) => {
                            const Icon = platform.icon;
                            const isSelected = selectedPlatforms?.includes(platform.id);
                            return (
                                <div
                                    key={idx}
                                    className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                        isSelected ? "border-purple-300 bg-purple-50 text-purple-600" : "border-gray-200 hover:border-gray-300"
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
                        {errors.platforms && <p className="text-sm text-red-500">{errors.platforms.message}</p>}
                    </CardContent>
                </Card>

                <Card className="bg-default-100 border-0 shadow-lg">
                    <CardContent className="pt-6 space-y-3">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Switch id="post-later" checked={postLater} onCheckedChange={setPostLater} />
                                <Label htmlFor="post-later">Post Later?</Label>
                            </div>
                            {postLater && (
                                <>
                                    <Input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                                    {errors.scheduledAt && <p className="text-sm text-red-500">{errors.scheduledAt.message}</p>}
                                </>
                            )}
                        </div>
                        {postLater && (
                            <Button variant="outline" onClick={handleSchedulePost} className="w-full" disabled={createPostMutation.isPending}>
                                <Clock className="h-4 w-4 mr-2" />
                                {createPostMutation.isPending ? "Scheduling..." : "Schedule Post"}
                            </Button>
                        )}
                        {!postLater && (
                            <Button onClick={handleCreateDraft} className="w-full gradient-blue" size="lg" disabled={createPostMutation.isPending}>
                                <Send className="h-4 w-4 mr-2" />
                                {createPostMutation.isPending ? "Creating..." : "Create Draft"}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <Card className="gradient-blue">
                    <CardHeader>
                        <CardTitle className="text-sm opacity-90">Best Time to Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-bold">3:00 PM - 5:00 PM</div>
                        <p className="text-xs opacity-90">Based on your audience activity</p>
                    </CardContent>
                </Card>

                {mediaFiles.length > 0 && (
                    <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-sm">Media Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {mediaFiles.map((file, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                        <ImageIcon className="h-4 w-4 text-gray-500" />
                                        <span className="truncate">{file.name}</span>
                                        <Badge variant="outline" className="text-xs">
                                            {file.type}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default PostCreator;
