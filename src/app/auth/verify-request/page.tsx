"use client";

import React from "react";
import { Mail, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoSvg } from "@/components/logo";
import Image from "next/image";
import CheckEmailSvg from "@/assets/check-email.png";

export default function VerifyRequestPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 flex">
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="w-full h-full flex flex-col justify-center items-center p-12 relative">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-teal-200 rounded-full opacity-30 animate-pulse delay-300"></div>
                        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-green-200 rounded-full opacity-25 animate-pulse delay-700"></div>
                    </div>

                    <div className="relative z-10 mb-8">
                        <Image src={CheckEmailSvg} alt="Check Email" />
                    </div>

                    <div className="text-center relative z-10">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
                            <LogoSvg className="text-emerald-600 h-12 w-12" />
                            CRM
                        </h1>
                        <p className="text-xl text-gray-600 mb-6 max-w-md">
                            Your magic link is on its way to help you access sustainable merchandise solutions
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 lg:p-12">
                <div className="lg:hidden mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                        <LogoSvg className="text-emerald-600 h-12 w-12" />
                        CRM
                    </h1>
                </div>

                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 border border-emerald-100">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
                                <Mail className="text-emerald-600" size={32} />
                            </div>

                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Check your email</h2>

                            <p className="text-gray-600 mb-2">We&apos;ve sent a magic link to your email</p>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <Clock className="text-emerald-600 mt-0.5 flex-shrink-0" size={20} />
                                    <div className="text-left">
                                        <p className="text-sm font-medium text-emerald-800 mb-1">Link expires in 15 minutes</p>
                                        <p className="text-xs text-emerald-700">Click the link in your email to sign in securely</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button variant="emerald" size="lg" onClick={() => window.history.back()} className="w-full py-3 px-4 rounded-full">
                                    <ArrowLeft size={16} />
                                    Back to sign in
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
                        <h3 className="font-medium text-gray-800 mb-2">Having trouble?</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Check your spam or junk folder</li>
                            <li>• Make sure the email address is correct</li>
                            <li>• Try resending the link if it&apos;s been a few minutes</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
