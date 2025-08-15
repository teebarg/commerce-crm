"use client";

import { Mail, Send } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

interface Props {
    onBack: () => void;
}

const MagicLink: React.FC<Props> = ({ onBack }) => {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";

    async function handleMagicLink(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        await signIn("http-email", {
            email,
            callbackUrl,
        });
    }

    return (
        <React.Fragment>
            <div className="group">
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full mb-4 h-12"
                    required
                    startContent={<Mail className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />}
                />
            </div>
            <Button onClick={handleMagicLink} disabled={loading} isLoading={loading} variant="primary" className="w-full py-4 gap-2" size="lg">
                <Send className="w-5 h-5" />
                Send Magic Link
            </Button>
            <div className="text-center mt-8">
                <button onClick={onBack} className="text-gray-600 dark:text-gray-400 font-medium">
                    ← Back to password sign in
                </button>
            </div>
        </React.Fragment>
    );
};

export default MagicLink;
