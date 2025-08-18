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
            lastName: string | undefined;
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
                    const user = await db.user.findUnique({
                        where: {
                            email: credentials.email as string,
                        },
                    });

                    if (user?.password && credentials?.password) {
                        const validPassword = await bcrypt.compare(credentials?.password as string, user.password);

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
                    console.log(error);
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
        // {
        //     id: "http-email",
        //     name: "Email",
        //     type: "email",
        //     maxAge: 60 * 60,
        //     async sendVerificationRequest({ identifier: email, url }) {
        //         try {
        //             const endpoint = `${env.BASE_URL}/api/auth/send-verification`;
        //             await fetch(endpoint, {
        //                 method: "POST",
        //                 headers: {
        //                     "content-type": "application/json",
        //                     "x-auth-secret": env.AUTH_SECRET ?? "",
        //                 },
        //                 body: JSON.stringify({ email, url }),
        //             });
        //         } catch (error) {
        //             console.log("🚀 ~ file: config.ts:134 ~ error:", error);
        //             throw new Error(error as string);
        //         }
        //     },
        // },
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24,
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
        verifyRequest: "/auth/verify-request",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "email") {
                const existingUser = await db.user.findUnique({
                    where: { email: user.email! },
                });
                const uuid = crypto.randomUUID();
                const hash = await bcrypt.hash(uuid, 10);

                if (!existingUser) {
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
        },
        async jwt({ token, user, account, profile }) {
            if (!account) {
                return token;
            }
            if (account?.provider === "google" && profile) {
                await db.user.upsert({
                    where: { email: user.email! },
                    create: {
                        name: profile.name,
                        firstName: profile.given_name,
                        lastName: profile.family_name,
                        image: profile.picture,
                        email: user.email!,
                        status: "ACTIVE",
                        password: "hash",
                    },
                    update: {},
                });
            }
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

            return token;
        },
        async session({ session, token }) {
            if (token?.sub) {
                session.user.id = token.sub;
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.name = token.name!;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
