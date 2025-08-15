"use client";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CredentialsForm: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const error = searchParams?.get("error");

    async function handlePasswordSignIn(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        await signIn("next-auth", {
            email,
            password,
            callbackUrl,
        });
        setLoading(false);
    }

    useEffect(() => {
        if (error) {
            toast.error("Invalid email or password");
        }
    }, [error]);

    return (
        <form onSubmit={handlePasswordSignIn}>
            <div className="group mb-4">
                <Input
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    data-testid="email-input"
                    label="Email"
                    name="email"
                    type="email"
                    startContent={<Mail className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />}
                />
            </div>

            <div className="relative group">
                <Input
                    required
                    autoComplete="new-password"
                    startContent={<Lock className="w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />}
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    endContent={
                        showPassword ? (
                            <EyeOff onClick={() => setShowPassword(false)} className="h-6 w-6" />
                        ) : (
                            <Eye onClick={() => setShowPassword(true)} className="h-6 w-6" />
                        )
                    }
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                />
            </div>

            <Button type="submit" disabled={loading} isLoading={loading} variant="primary" className="w-full py-4 mt-4" size="lg">
                Sign In
            </Button>
        </form>
    );
};

export default CredentialsForm;
