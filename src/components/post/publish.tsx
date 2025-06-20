"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Send } from "nui-react-icons";
import type React from "react";
import { toast } from "sonner";

type Props = {
    id: string;
};

const Publish: React.FC<Props> = ({ id }) => {
    const router = useRouter();
    const utils = api.useUtils();

    const mutation = api.draft.publish.useMutation({
        onSuccess: async () => {
            toast.success("Draft published successfully.");
            await utils.user.invalidate();
            router.refresh();
        },
        onError: (error: unknown) => {
            toast.error(`Error = ${error as string}`);
        },
    });

    const publishPost = () => {
        mutation.mutate(id);
    };

    return (
        <Button
            onClick={publishPost}
            className="text-blue-600 hover:bg-blue-50 rounded-full transition-colors p-1 min-w-0 h-auto bg-transparent"
            isLoading={mutation.isPending}
        >
            <Send className="w-5 h-5" />
        </Button>
    );
};

export { Publish };
