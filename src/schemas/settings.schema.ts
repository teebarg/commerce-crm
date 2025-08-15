import { z } from "zod";

export const NotificationPrefsSchema = z.object({
  postScheduled: z.boolean().default(true),
  postPublished: z.boolean().default(true),
  engagementAlerts: z.boolean().default(false),
  weeklyReports: z.boolean().default(true),
  systemUpdates: z.boolean().default(true),
});

export const UserSettingsSchema = z.object({
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  defaultHashtags: z.string().optional(),
  timezone: z.string().optional(),
  defaultPostTime: z.string().optional(),
  notifications: NotificationPrefsSchema.optional(),
});

export type UserSettingsInput = z.infer<typeof UserSettingsSchema>;