/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";

import { db } from "@/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            firstName: string;
            lastName: string | null;
            email: string;
        } & DefaultSession["user"];
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
    providers: [
        CredentialsProvider({
            id: "next-auth",
            name: "email",
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const user = await db.user.findUnique({
                        where: {
                            email: credentials.email as string,
                        },
                    });

                    if (user?.password && credentials?.password) {
                        const validPassword = await bcrypt.compare(credentials.password as string, user.password);

                        if (validPassword) {
                            return {
                                id: user.id,
                                email: user.email,
                                firstName: user.firstName,
                                lastName: user.lastName,
                            };
                        }
                    }
                } catch (error) {
                    console.error("Authorization error:", error);
                }
                return null;
            },
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "example@email.com",
                },
                password: {
                    label: "Password",
                    type: "password",
                },
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30 * 12, // 30 days * 12 months
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
        verifyRequest: "/auth/verify-request",
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                if (account?.provider === "email") {
                    const existingUser = await db.user.findUnique({
                        where: { email: user.email! },
                    });

                    if (!existingUser) {
                        const uuid = crypto.randomUUID();
                        const hash = await bcrypt.hash(uuid, 10);

                        await db.user.create({
                            data: {
                                email: user.email!,
                                firstName: "User",
                                lastName: "User",
                                status: "PENDING",
                                password: hash,
                            },
                        });
                    }
                }
                return true;
            } catch (error) {
                console.error("SignIn callback error:", error);
                return false; // Prevent sign in on error
            }
        },

        async jwt({ token, user, account, profile }) {
            try {
                // If this is the first time the callback is called (user exists)
                if (account && user) {
                    if (account.provider === "google" && profile) {
                        await db.user.upsert({
                            where: { email: user.email! },
                            create: {
                                name: profile.name,
                                firstName: profile.given_name || "User",
                                lastName: profile.family_name || null,
                                image: profile.picture || null,
                                email: user.email!,
                                status: "ACTIVE",
                                password: "hash", // Consider using a more secure approach
                            },
                            update: {
                                name: profile.name,
                                firstName: profile.given_name || undefined,
                                lastName: profile.family_name || undefined,
                                image: profile.picture || undefined,
                            },
                        });
                    }

                    // Fetch the user data to add to token
                    const existingUser = await db.user.findUnique({
                        where: { email: user.email! },
                    });

                    if (existingUser) {
                        token.user = {
                            id: existingUser.id,
                            email: existingUser.email,
                            firstName: existingUser.firstName,
                            lastName: existingUser.lastName,
                            image: existingUser.image,
                        };
                    }
                }

                // Return previous token if no new information
                return token;
            } catch (error) {
                console.error("JWT callback error:", error);
                // Return the token as-is to prevent session corruption
                return token;
            }
        },

        async session({ session, token }) {
            try {
                // Type assertion to ensure TypeScript knows about our custom properties
                const customToken = token as typeof token & {
                    user?: {
                        id: string;
                        email: string;
                        firstName: string;
                        lastName: string | null;
                        image: string | null;
                    };
                };

                if (token?.sub && customToken.user) {
                    session.user.id = customToken.user.id;
                    session.user.firstName = customToken.user.firstName;
                    session.user.lastName = customToken.user.lastName;
                    session.user.email = customToken.user.email;
                    session.user.name = customToken.user.firstName + (customToken.user.lastName ? ` ${customToken.user.lastName}` : "");
                    session.user.image = customToken.user.image;
                }
                return session;
            } catch (error) {
                console.error("Session callback error:", error);
                return session;
            }
        },
    },
    debug: process.env.NODE_ENV === "development",
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
