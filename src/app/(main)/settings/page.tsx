import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, User, Bell, Globe, Hash } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { api } from "@/trpc/react";
import { UserSettingsSchema, type UserSettingsInput } from "@/schemas/settings.schema";

const defaultValues: UserSettingsInput = {
    instagram: "",
    twitter: "",
    facebook: "",
    tiktok: "",
    defaultHashtags: "",
    timezone: "UTC",
    defaultPostTime: "09:00",
    notifications: {
        postScheduled: true,
        postPublished: true,
        engagementAlerts: false,
        weeklyReports: true,
        systemUpdates: true,
    },
};

const Settings = () => {
    const { data: settings, isLoading } = api.user.getUserSettings.useQuery();
    const updateSettings = api.user.updateUserSettings.useMutation();
    const form = useForm<UserSettingsInput>({
        resolver: zodResolver(UserSettingsSchema),
        defaultValues,
    });
    const { register, handleSubmit, control, setValue, watch, formState: { errors, isDirty } } = form;

    useEffect(() => {
        if (settings) {
            setValue("instagram", settings.instagram ?? "");
            setValue("twitter", settings.twitter ?? "");
            setValue("facebook", settings.facebook ?? "");
            setValue("tiktok", settings.tiktok ?? "");
            setValue("defaultHashtags", settings.defaultHashtags ?? "");
            setValue("timezone", settings.timezone ?? "UTC");
            setValue("defaultPostTime", settings.defaultPostTime ?? "09:00");
            // setValue("notifications", settings.notifications ?? defaultValues.notifications);
        }
    }, [settings, setValue]);

    const onSubmit = async (data: UserSettingsInput) => {
        try {
            await updateSettings.mutateAsync(data);
            toast.success("Settings saved!");
        } catch (e: any) {
            toast.error(`${e.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
            <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Link href="/" className="flex items-center gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Link>
                        </div>
                        <Button onClick={handleSubmit(onSubmit)} className="flex items-center gap-2" disabled={!isDirty || updateSettings.isPending}>
                            <Save className="h-4 w-4" />
                            {updateSettings.isPending ? "Saving..." : "Save Settings"}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        {/* Platform Handles */}
                        <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-purple-600" />
                                    Platform Handles
                                </CardTitle>
                                <CardDescription>Configure your social media handles for each platform</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Instagram Handle"
                                        placeholder="your_instagram_handle"
                                        {...register("instagram")}
                                        startContent={
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                @
                                            </span>
                                        }
                                    />

                                    <Input
                                        label="Twitter/X Handle"
                                        placeholder="your_twitter_handle"
                                        {...register("twitter")}
                                        startContent={
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                @
                                            </span>
                                        }
                                    />

                                    <Input label="Facebook Page" placeholder="Your Facebook Page Name" {...register("facebook")} />

                                    <Input
                                        label="TikTok Handle"
                                        placeholder="your_tiktok_handle"
                                        {...register("tiktok")}
                                        startContent={
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                @
                                            </span>
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Default Hashtags" placeholder="#marketing #growth" {...register("defaultHashtags")} startContent={<Hash className="h-4 w-4 text-gray-400" />} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notification Settings */}
                        <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-purple-600" />
                                    Notification Preferences
                                </CardTitle>
                                <CardDescription>Choose when and how you want to be notified</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Controller name="notifications.postScheduled" control={control} render={({ field }) => (
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Post Scheduled</Label>
                                            <p className="text-sm text-gray-500">Get notified when posts are scheduled</p>
                                        </div>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </div>
                                )} />

                                <Separator />

                                <Controller name="notifications.postPublished" control={control} render={({ field }) => (
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Post Published</Label>
                                            <p className="text-sm text-gray-500">Get notified when posts go live</p>
                                        </div>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </div>
                                )} />

                                <Separator />

                                <Controller name="notifications.engagementAlerts" control={control} render={({ field }) => (
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Engagement Alerts</Label>
                                            <p className="text-sm text-gray-500">Get notified about high engagement posts</p>
                                        </div>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </div>
                                )} />

                                <Separator />

                                <Controller name="notifications.weeklyReports" control={control} render={({ field }) => (
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Weekly Reports</Label>
                                            <p className="text-sm text-gray-500">Receive weekly performance summaries</p>
                                        </div>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </div>
                                )} />

                                <Separator />

                                <Controller name="notifications.systemUpdates" control={control} render={({ field }) => (
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>System Updates</Label>
                                            <p className="text-sm text-gray-500">Get notified about app updates and maintenance</p>
                                        </div>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </div>
                                )} />
                            </CardContent>
                        </Card>

                        {/* General Settings */}
                        <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-purple-600" />
                                    General Settings
                                </CardTitle>
                                <CardDescription>Configure general application preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Controller name="timezone" control={control} render={({ field }) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="timezone">Timezone</Label>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select timezone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="UTC">UTC</SelectItem>
                                                    <SelectItem value="EST">Eastern Time</SelectItem>
                                                    <SelectItem value="PST">Pacific Time</SelectItem>
                                                    <SelectItem value="CET">Central European Time</SelectItem>
                                                    <SelectItem value="JST">Japan Standard Time</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )} />

                                    <Input label="Default Post Time" type="time" {...register("defaultPostTime")} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
