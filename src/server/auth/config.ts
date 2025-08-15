export const runtime = "nodejs";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@auth/prisma-adapter";
import { type User, type DefaultSession, type NextAuthConfig } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import argon2 from "argon2";
// import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

import { db } from "@/server/db";
// import { env } from "@/env";
import { handleSendVerificationRequest } from "@/utils/email";

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
        // CredentialsProvider({
        //     id: "next-auth",
        //     name: "email",
        //     async authorize(credentials) {
        //         try {
        //             const user = await db.user.findUnique({
        //                 where: {
        //                     email: credentials.email as string,
        //                 },
        //             });

        //             if (user?.password && credentials?.password) {
        //                 const validPassword = await argon2.verify(user.password, credentials?.password as string);

        //                 if (validPassword) {
        //                     return {
        //                         id: user.id,
        //                         email: user.email,
        //                         firstName: user.firstName,
        //                         lastName: user.lastName,
        //                     };
        //                 }
        //             }
        //         } catch (error) {
        //             console.log(error);
        //         }
        //         return null;
        //     },
        //     credentials: {
        //         email: {
        //             label: "Email",
        //             type: "text",
        //             placeholder: "example@email.com",
        //         },
        //         password: {
        //             label: "Password",
        //             type: "password",
        //         },
        //     },
        // }),
        // EmailProvider({
        //     server: {
        //         host: env.EMAIL_SERVER,
        //         port: env.EMAIL_SERVER_PORT,
        //         auth: {
        //             user: env.EMAIL_SERVER_USER,
        //             pass: env.EMAIL_SERVER_PASSWORD,
        //         },
        //     },
        //     from: env.EMAIL_FROM,
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
        //             throw new Error(error as string);
        //         }
        //     },
        // }),
        {
            id: "http-email",
            name: "Email",
            type: "email",
            maxAge: 60 * 60,
            // async sendVerificationRequest({ identifier: email, url }) {
            //     try {
            //         const endpoint = `${env.BASE_URL}/api/auth/send-verification`;
            //         await fetch(endpoint, {
            //             method: "POST",
            //             headers: {
            //                 "content-type": "application/json",
            //                 "x-auth-secret": env.AUTH_SECRET ?? "",
            //             },
            //             body: JSON.stringify({ email, url }),
            //         });
            //     } catch (error) {
            //         console.log("🚀 ~ file: config.ts:134 ~ error:", error);
            //         // throw new Error(error as string);
            //     }
            // },
            async sendVerificationRequest({ identifier: email, url, provider }) {
                handleSendVerificationRequest({ email, url, provider });
                // const transport = createTransport(provider.server);
                // const emailHtml = await renderEmail("magic-link", { magic_link_url: url });

                // // Text version
                // const textTemplate = handlebars.compile(`
                //     Sign in to your account

                //     Click this link to sign in:
                //     {{url}}

                //     This link will expire in 24 hours and can only be used once.
                //     If you didn't request this email, you can safely ignore it.

                //     ---
                //     {{env.NEXT_PUBLIC_NAME}} Team
                // `);
                // const emailText = textTemplate({ url });

                // await transport.sendMail({
                //     to: email,
                //     from: provider.from,
                //     subject: "Sign in to your account",
                //     text: emailText,
                //     html: emailHtml,
                // });
            },
        },
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
            if (account?.provider === "email" || account?.provider === "google") {
                const existingUser = await db.user.findUnique({
                    where: { email: user.email! },
                });

                // const uuid = crypto.randomUUID();
                // const hash = await argon2.hash(uuid);

                if (!existingUser) {
                    await db.user.create({
                        data: {
                            email: user.email!,
                            firstName: "User",
                            lastName: "User",
                            status: "PENDING",
                            password: "random",
                        },
                    });
                }
            }
            return true;
        },
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
                session.user.name = (token.user as User).firstName! + " " + (token.user as User).lastName!;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
