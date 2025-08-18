import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        APP_NAME: z.string().min(1),
        AUTH_SECRET: process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),
        BASE_URL: z.string().url(),
        DATABASE_URL: z.string().url(),
        ADMIN_EMAIL: z.string().optional(),
        VAPID_PUBLIC_KEY: z.string().optional(),
        VAPID_PRIVATE_KEY: z.string().optional(),
        NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

        EMAIL_SERVER: z.string().optional(),
        EMAIL_FROM: z.string().optional(),
        EMAIL_SERVER_PORT: z.number().min(1),
        EMAIL_SERVER_USER: z.string().min(1),
        EMAIL_SERVER_PASSWORD: z.string().min(1),
        GOOGLE_CLIENT_ID: z.string().optional(),
        GOOGLE_CLIENT_SECRET: z.string().optional(),
        GEMINI_API_KEY: z.string(),

        TWITTER_CONSUMER_KEY: z.string().optional(),
        TWITTER_CONSUMER_SECRET: z.string().optional(),
        TWITTER_ACCESS_TOKEN: z.string().optional(),
        TWITTER_BEARER_TOKEN: z.string().optional(),
        TWITTER_ACCESS_TOKEN_SECRET: z.string().optional(),

        FACEBOOK_PAGE_ACCESS_TOKEN: z.string().optional(),
        FACEBOOK_PAGE_ID: z.string().optional(),

        INSTAGRAM_USER_ID: z.string().optional(),
        INSTAGRAM_ACCESS_TOKEN: z.string().optional(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        // NEXT_PUBLIC_CLIENTVAR: z.string(),
        NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
        NEXT_PUBLIC_CONTACT_EMAIL: z.string().optional(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
        AUTH_SECRET: process.env.AUTH_SECRET,
        BASE_URL: process.env.BASE_URL,
        NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
        DATABASE_URL: process.env.DATABASE_URL,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY,
        NODE_ENV: process.env.NODE_ENV,

        EMAIL_SERVER: process.env.EMAIL_SERVER,
        EMAIL_FROM: process.env.EMAIL_FROM,
        EMAIL_SERVER_PORT: Number(process.env.EMAIL_SERVER_PORT),
        EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
        EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,

        TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
        TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
        TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
        TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN,
        TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,

        FACEBOOK_PAGE_ACCESS_TOKEN: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
        FACEBOOK_PAGE_ID: process.env.FACEBOOK_PAGE_ID,

        INSTAGRAM_USER_ID: process.env.INSTAGRAM_USER_ID,
        INSTAGRAM_ACCESS_TOKEN: process.env.INSTAGRAM_ACCESS_TOKEN,

        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    /**
     * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
     * `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
});
