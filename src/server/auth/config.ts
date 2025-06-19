/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type User, type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import argon2 from "argon2";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/server/db";
import { env } from "@/env";
import { createTransport } from "nodemailer";
import { renderEmail } from "@/utils/email";
import handlebars from "handlebars";

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
            lastName: string;
            email: string;
            // ...other properties
            // role: UserRole;
        } & DefaultSession["user"];
    }

    interface User {
        // ...other properties
        id?: string;
        firstName?: string | null | undefined;
        lastName?: string | null | undefined;
        email?: string | null | undefined;
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
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
                        const validPassword = await argon2.verify(user.password, credentials?.password as string);

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
        EmailProvider({
            server: {
                host: env.EMAIL_SERVER,
                port: env.EMAIL_SERVER_PORT,
                auth: {
                    user: env.EMAIL_SERVER_USER,
                    pass: env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: env.EMAIL_FROM,
            async sendVerificationRequest({ identifier: email, url, provider }) {
                const transport = createTransport(provider.server);
                const emailHtml = await renderEmail("magic-link", { magic_link_url: url });

                // Text version
                const textTemplate = handlebars.compile(`
                    Sign in to your account

                    Click this link to sign in:
                    {{url}}

                    This link will expire in 24 hours and can only be used once.
                    If you didn't request this email, you can safely ignore it.

                    ---
                    {{env.NEXT_PUBLIC_NAME}} Team
                `);
                const emailText = textTemplate({ url });

                await transport.sendMail({
                    to: email,
                    from: provider.from,
                    subject: "Sign in to your account",
                    text: emailText,
                    html: emailHtml,
                });
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24,
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.user = {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
            }

            return token;
        },
        async session({ session, token }) {
            if (token?.sub) {
                session.user.id = token.sub;
                session.user.firstName = (token.user as User).firstName!;
                session.user.lastName = (token.user as User).lastName!;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
