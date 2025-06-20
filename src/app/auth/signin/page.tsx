"use client";

import React, { useState } from "react";
import MagicLink from "@/components/auth/magic-link";
import CredentialsForm from "@/components/auth/credentials-form";
import Google from "@/components/auth/google";
import { Send, Lock } from "lucide-react";

const AuthUI = () => {
    const [authMode, setAuthMode] = useState<"signin" | "email">("signin");

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/20 to-blue-500/20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-500/20 blur-3xl"></div>
            </div>
            <div className="relative w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                            {authMode === "email" ? <Send className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-600">
                            {authMode === "email" ? "Sign in with a magic link" : "Sign in to your account"}
                        </p>
                    </div>

                    <div className="space-y-6">
                        {authMode === "email" ? (
                            <MagicLink onBack={() => setAuthMode("signin")} />
                        ) : (
                            <CredentialsForm />
                        )}
                    </div>

                    {authMode !== "email" && (
                        <div className="my-8 flex items-center">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                            <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80">or continue with</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                        </div>
                    )}

                    {authMode !== "email" && (
                        <div className="space-y-3">
                            <Google />

                            <button
                                onClick={() => setAuthMode("email")}
                                className="w-full flex items-center justify-center py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 group shadow-sm hover:shadow-md"
                            >
                                <Send className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Continue with Magic Link</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">Protected by industry-standard encryption</p>
                </div>
            </div>
        </div>
    );
};

export default AuthUI;
