"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/trpc/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";

const shopSettingsFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyPhone: z.string().min(1, "Company phone is required"),
  contactEmail: z.string().email("Invalid email address"),
  supportLink: z.string().url("Invalid URL"),
  unsubscribeLink: z.string().url("Invalid URL"),
  preferencesLink: z.string().url("Invalid URL"),
  socialLinks: z.object({
    facebook: z.string().url("Invalid Facebook URL"),
    instagram: z.string().url("Invalid Instagram URL"),
    twitter: z.string().url("Invalid Twitter URL")
  })
});

type ShopSettingsFormValues = z.infer<typeof shopSettingsFormSchema>;

export default function EmailSettingsPage() {
  const { data: settings, isLoading } = api.email.getShopSettings.useQuery();
  const utils = api.useUtils();

  const updateMutation = api.email.updateShopSettings.useMutation({
    onSuccess: () => {
      toast.success("Settings updated successfully");
      void utils.email.getShopSettings.invalidate();
    },
    onError: () => toast.error("Failed to update settings")
  });

  const form = useForm<ShopSettingsFormValues>({
    resolver: zodResolver(shopSettingsFormSchema),
    defaultValues: {
      companyName: settings?.companyName || "",
      companyAddress: settings?.companyAddress || "",
      companyPhone: settings?.companyPhone || "",
      contactEmail: settings?.contactEmail || "",
      supportLink: settings?.supportLink || "",
      unsubscribeLink: settings?.unsubscribeLink || "",
      preferencesLink: settings?.preferencesLink || "",
      socialLinks: (settings?.socialLinks as any) || {
        facebook: "",
        instagram: "",
        twitter: ""
      }
    }
  });

  function onSubmit(data: ShopSettingsFormValues) {
    updateMutation.mutate(data);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ReloadIcon className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>
            Configure company information and links used in all email campaigns
          </CardDescription>
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
                <h3 className="text-lg font-medium">Social Media Links</h3>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="socialLinks.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/..." {...field} />
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
                          <Input placeholder="https://instagram.com/..." {...field} />
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
                          <Input placeholder="https://twitter.com/..." {...field} />
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

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
