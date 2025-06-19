"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    async function handlePasswordSignIn(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await signIn("next-auth", {
            email,
            password,
            redirect: false,
            callbackUrl,
        });
        setLoading(false);
        if (res?.error) setError(res.error);
        else if (res?.ok) window.location.href = callbackUrl;
    }

    async function handleMagicLink(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await signIn("email", {
            email,
            redirect: false,
            callbackUrl,
        });
        setLoading(false);
        if (res?.error) setError(res.error);
        else setError("Check your email for a magic link!");
    }

    async function handleGoogle() {
        setLoading(true);
        setError("");
        await signIn("google", { callbackUrl });
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col gap-6">
                <h1 className="text-3xl font-bold text-center text-indigo-700">Sign in to Commerce CRM</h1>
                <button
                    onClick={handleGoogle}
                    className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    disabled={loading}
                >
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                        <g>
                            <path
                                fill="#4285F4"
                                d="M24 9.5c3.54 0 6.7 1.22 9.19 3.22l6.85-6.85C36.68 2.7 30.74 0 24 0 14.82 0 6.73 5.48 2.69 13.44l7.98 6.2C12.13 13.16 17.62 9.5 24 9.5z"
                            />
                            <path
                                fill="#34A853"
                                d="M46.1 24.5c0-1.64-.15-3.22-.42-4.74H24v9.04h12.42c-.54 2.9-2.18 5.36-4.64 7.04l7.18 5.6C43.98 37.1 46.1 31.24 46.1 24.5z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M10.67 28.04A14.5 14.5 0 019.5 24c0-1.4.23-2.76.64-4.04l-7.98-6.2A23.93 23.93 0 000 24c0 3.82.92 7.44 2.56 10.6l8.11-6.56z"
                            />
                            <path
                                fill="#EA4335"
                                d="M24 48c6.48 0 11.92-2.14 15.89-5.84l-7.18-5.6c-2.01 1.36-4.6 2.18-8.71 2.18-6.38 0-11.87-3.66-14.33-8.94l-8.11 6.56C6.73 42.52 14.82 48 24 48z"
                            />
                        </g>
                    </svg>
                    Continue with Google
                </button>
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-300" />
                    <span className="text-gray-400 text-sm">or</span>
                    <div className="flex-1 h-px bg-gray-300" />
                </div>
                <form className="flex flex-col gap-4" onSubmit={handlePasswordSignIn}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password (or leave blank for magic link)"
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                        disabled={loading}
                    >
                        Sign in with Password
                    </button>
                </form>
                <form className="flex flex-col gap-2" onSubmit={handleMagicLink}>
                    <button
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                        disabled={loading || !email}
                    >
                        Send Magic Link
                    </button>
                </form>
                {error && <div className="text-center text-red-500 font-medium">{error}</div>}
            </div>
        </div>
    );
}
