"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Google: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";

    async function handleGoogle() {
        setLoading(true);
        await signIn("google", { callbackUrl });
        setLoading(false);
    }

    return (
        <Button className="w-full" disabled={loading} isLoading={loading} variant="outline" onClick={() => handleGoogle()} size="lg">
            <Image alt="Google" className="w-5 h-5 mr-2" width={20} height={20} src="/google.svg" />
            Continue with Google
        </Button>
    );
};

export default Google;
