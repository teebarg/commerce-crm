"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { shopSettingsSchema } from "@/schemas/base.schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

type ShopSettingsFormValues = z.infer<typeof shopSettingsSchema>;

export default function EmailSettingsPage() {
    const { data: settings, isLoading } = api.email.getShopSettings.useQuery();
    const utils = api.useUtils();

    const updateMutation = api.email.updateShopSettings.useMutation({
        onSuccess: () => {
            toast.success("Settings updated successfully");
            void utils.email.getShopSettings.invalidate();
        },
        onError: () => toast.error("Failed to update settings"),
    });

    const form = useForm<ShopSettingsFormValues>({
        resolver: zodResolver(shopSettingsSchema),
        defaultValues: {
            companyName: settings?.companyName ?? "",
            companyAddress: settings?.companyAddress ?? "",
            companyPhone: settings?.companyPhone ?? "",
            contactEmail: settings?.contactEmail ?? "",
            supportLink: settings?.supportLink ?? "",
            unsubscribeLink: settings?.unsubscribeLink ?? "",
            preferencesLink: settings?.preferencesLink ?? "",
            socialLinks: (settings?.socialLinks as any) ?? {
                facebook: "",
                instagram: "",
                twitter: "",
            },
        },
    });

    // Add this effect to update form values when settings change
    useEffect(() => {
        if (settings) {
            form.setValue("companyName", settings.companyName ?? "");
            form.setValue("companyAddress", settings.companyAddress ?? "");
            form.setValue("companyPhone", settings.companyPhone ?? "");
            form.setValue("contactEmail", settings.contactEmail ?? "");
            form.setValue("supportLink", settings.supportLink ?? "");
            form.setValue("unsubscribeLink", settings.unsubscribeLink ?? "");
            form.setValue("preferencesLink", settings.preferencesLink ?? "");
            form.setValue(
                "socialLinks",
                (settings.socialLinks as any) ?? {
                    facebook: "",
                    instagram: "",
                    twitter: "",
                }
            );
        }
    }, [settings, form]);

    function onSubmit(data: ShopSettingsFormValues) {
        updateMutation.mutate(data);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <RefreshCcw className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container py-8 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle>Email Settings</CardTitle>
                    <CardDescription>Configure company information and links used in all email campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Company Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="companyName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="ThriftByOba" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="companyAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Company Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123 Thrift St, Oba City" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="companyPhone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+234 123 456 7890" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="contactEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="contact@thriftbyoba.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Social Media Handles</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="socialLinks.facebook"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Facebook</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://facebook.com/..."
                                                        {...field}
                                                        startContent={<AtSign className="h-5 w-5" />}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="socialLinks.instagram"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Instagram</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://instagram.com/..."
                                                        {...field}
                                                        startContent={<AtSign className="h-5 w-5" />}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="socialLinks.twitter"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Twitter</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="https://twitter.com/..."
                                                        {...field}
                                                        startContent={<AtSign className="h-5 w-5" />}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Customer Service Links</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="supportLink"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Support Page URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="unsubscribeLink"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Unsubscribe Page URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="preferencesLink"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Preferences Page URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full sm:w-auto" disabled={updateMutation.isPending} variant="primary">
                                {updateMutation.isPending ? "Saving..." : "Save Settings"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
