"use client";

import React from "react";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { env } from "@/env";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogoSvg } from "@/components/logo";

export default function ErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams?.get("error");

    const getErrorContent = () => {
        switch (error) {
            case "Verification":
                return {
                    title: "Link expired",
                    message: "Your magic link has expired for security reasons.",
                    details: "Magic links are only valid for 15 minutes. Please request a new one to continue.",
                    action: "Get new magic link",
                };
            case "invalid":
                return {
                    title: "Invalid link",
                    message: "This magic link is not valid or has already been used.",
                    details: "Links can only be used once. If you need to sign in again, please request a new magic link.",
                    action: "Get new magic link",
                };
            case "network":
                return {
                    title: "Connection error",
                    message: "Unable to connect to our servers.",
                    details: "Please check your internet connection and try again.",
                    action: "Try again",
                };
            case "Configuration":
                return {
                    title: "Configuration error",
                    message: "There is a problem with the server configuration.",
                    details: "Check the server logs for more information.",
                    action: "Try again",
                };
            case "Accessdenied":
                return {
                    title: "Access denied",
                    message: "You do not have permission to access this page.",
                    details: "Please contact support if you believe this is in error.",
                    action: "Contact support",
                };
            default:
                return {
                    title: "Something went wrong",
                    message: "We encountered an unexpected error.",
                    details: "Our team has been notified. Please try again or contact support if the problem persists.",
                    action: "Try again",
                };
        }
    };

    const errorContent = getErrorContent();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex">
            {/* Left */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="w-full h-full flex flex-col justify-center items-center p-12 relative">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-orange-200 rounded-full opacity-30 animate-pulse delay-300"></div>
                        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-amber-200 rounded-full opacity-25 animate-pulse delay-700"></div>
                    </div>

                    <div className="relative z-10 mb-8">
                        <svg width="320" height="320" viewBox="0 0 320 320" className="drop-shadow-lg">
                            <circle cx="160" cy="160" r="150" fill="url(#errorGradient)" opacity="0.1" />
                            <circle cx="160" cy="160" r="80" fill="#fed7aa" stroke="#f97316" strokeWidth="4" />
                            <path d="M160 120 L160 180" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" />
                            <circle cx="160" cy="200" r="4" fill="#ea580c" />
                            <path d="M100 100 L120 120 M120 100 L100 120" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                            <path d="M220 100 L200 120 M200 100 L220 120" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                            <path d="M100 220 L120 200 M120 220 L100 200" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
                            <path d="M220 220 L200 200 M200 220 L220 200" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />

                            <defs>
                                <linearGradient id="errorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f97316" />
                                    <stop offset="100%" stopColor="#ea580c" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="text-center relative z-10">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                            <LogoSvg className="text-emerald-600 h-12 w-12" />
                            crm
                        </h1>
                        <p className="text-xl text-gray-600 mb-6 max-w-md">
                            Don&apos;t worry - we&apos;ll get you back on track to sustainable merchandise solutions
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 lg:p-12">
                <div className="lg:hidden mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                        <LogoSvg className="text-emerald-600 h-12 w-12" />
                        crm
                    </h1>
                </div>

                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
                                <AlertTriangle className="text-orange-600" size={32} />
                            </div>

                            <h2 className="text-3xl font-bold text-gray-800 mb-4">{errorContent.title}</h2>
                            <p className="text-gray-600 text-lg mb-4">{errorContent.message}</p>
                            <p className="text-sm text-gray-500 mb-8">{errorContent.details}</p>

                            <div className="space-y-4">
                                <Button variant="emerald" onClick={() => window.history.back()} className="w-full py-3 px-4 border border-emerald-200 rounded-lg">
                                    <ArrowLeft size={16} />
                                    Back to sign in
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Still having trouble?{" "}
                            <a href={`mailto:${env.CONTACT_EMAIL}`} className="text-emerald-600 hover:text-emerald-700 font-medium">
                                Contact support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
