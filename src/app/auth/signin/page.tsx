import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Send, Chrome } from "lucide-react";

const AuthUI = () => {
    const [authMode, setAuthMode] = useState("signin"); // 'signin', 'signup', 'email'
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (authMode === "email") {
            // signIn('email', { email }) - NextAuth email provider
            setEmailSent(true);
            console.log("Magic link sent to:", email);
        } else {
            // signIn('credentials', { email, password }) - NextAuth credentials
            console.log("Credentials sign-in:", { email, password, name });
        }
    };

    const handleGoogleSignIn = () => {
        // signIn('google') - NextAuth integration
        console.log("Google sign-in");
    };

    const handleEmailAuth = () => {
        // signIn('email', { email }) - NextAuth email provider
        if (email) {
            setEmailSent(true);
            console.log("Magic link sent to:", email);
        } else {
            setAuthMode("email");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-green-400/20 to-blue-500/20 blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-purple-400/20 to-pink-500/20 blur-3xl"></div>
            </div>

            {/* Main Container */}
            <div className="relative w-full max-w-md">
                {/* Glass Card */}
                <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 transform transition-all duration-500 hover:scale-[1.02]">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                            {authMode === "email" ? <Send className="w-8 h-8 text-white" /> : <Lock className="w-8 h-8 text-white" />}
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            {authMode === "email"
                                ? emailSent
                                    ? "Check Your Email"
                                    : "Magic Link"
                                : authMode === "signup"
                                  ? "Create Account"
                                  : "Welcome Back"}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {authMode === "email"
                                ? emailSent
                                    ? "We sent you a sign-in link"
                                    : "Sign in with a magic link"
                                : authMode === "signup"
                                  ? "Sign up to get started"
                                  : "Sign in to your account"}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="space-y-6">
                        {emailSent ? (
                            /* Email Sent State */
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Check your email for a sign-in link. If you don't see it, check your spam folder.
                                </p>
                                <button
                                    onClick={() => {
                                        setEmailSent(false);
                                        setAuthMode("signin");
                                    }}
                                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors duration-200"
                                >
                                    ← Back to sign in
                                </button>
                            </div>
                        ) : authMode === "email" ? (
                            /* Email Magic Link Form */
                            <>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-focus-within:from-green-500/10 group-focus-within:via-green-500/5 group-focus-within:to-green-500/10 transition-all duration-200 pointer-events-none"></div>
                                </div>
                                <button
                                    onClick={handleEmailAuth}
                                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Magic Link
                                </button>
                                <div className="text-center">
                                    <button
                                        onClick={() => setAuthMode("signin")}
                                        className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors duration-200"
                                    >
                                        ← Back to password sign in
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* Credentials Form */
                            <>
                                {/* Name Field (Sign Up Only) */}
                                {authMode === "signup" && (
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <div className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200">
                                                👤
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Full Name"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                            required
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-focus-within:from-green-500/10 group-focus-within:via-green-500/5 group-focus-within:to-green-500/10 transition-all duration-200 pointer-events-none"></div>
                                    </div>
                                )}

                                {/* Email Field */}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email Address"
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        required
                                    />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-focus-within:from-green-500/10 group-focus-within:via-green-500/5 group-focus-within:to-green-500/10 transition-all duration-200 pointer-events-none"></div>
                                </div>

                                {/* Password Field */}
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        className="w-full pl-12 pr-12 py-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" />
                                        )}
                                    </button>
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-focus-within:from-green-500/10 group-focus-within:via-green-500/5 group-focus-within:to-green-500/10 transition-all duration-200 pointer-events-none"></div>
                                </div>

                                {/* Forgot Password & Magic Link (Sign In Only) */}
                                {authMode === "signin" && (
                                    <div className="flex justify-between items-center text-sm">
                                        <button
                                            onClick={() => setAuthMode("email")}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                                        >
                                            Use Magic Link
                                        </button>
                                        <button
                                            type="button"
                                            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors duration-200"
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                >
                                    {authMode === "signup" ? "Create Account" : "Sign In"}
                                </button>
                            </>
                        )}
                    </div>

                    {/* Divider */}
                    {!emailSent && authMode !== "email" && (
                        <div className="my-8 flex items-center">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                            <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80">or continue with</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                        </div>
                    )}

                    {/* Social Buttons */}
                    {!emailSent && authMode !== "email" && (
                        <div className="space-y-3">
                            <button
                                onClick={handleGoogleSignIn}
                                className="w-full flex items-center justify-center py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 group shadow-sm hover:shadow-md"
                            >
                                <Chrome className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Continue with Google</span>
                            </button>

                            <button
                                onClick={handleEmailAuth}
                                className="w-full flex items-center justify-center py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 group shadow-sm hover:shadow-md"
                            >
                                <Send className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Continue with Magic Link</span>
                            </button>
                        </div>
                    )}

                    {/* Toggle Sign Up/Sign In */}
                    {!emailSent && authMode !== "email" && (
                        <div className="mt-8 text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                {authMode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                                <button
                                    type="button"
                                    onClick={() => setAuthMode(authMode === "signup" ? "signin" : "signup")}
                                    className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors duration-200"
                                >
                                    {authMode === "signup" ? "Sign In" : "Sign Up"}
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom Decoration */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Protected by industry-standard encryption</p>
                </div>
            </div>
        </div>
    );
};

export default AuthUI;
