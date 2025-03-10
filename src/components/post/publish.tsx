"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { Send } from "nui-react-icons";
import type React from "react";

type Props = {
    id: string;
};

const Publish: React.FC<Props> = ({ id }) => {
    const router = useRouter();
    const utils = api.useUtils();

    const { enqueueSnackbar } = useSnackbar();

    const mutation = api.draft.publish.useMutation({
        onSuccess: async () => {
            enqueueSnackbar("Draft published successfully.", { variant: "success" });
            await utils.user.invalidate();
            router.refresh();
        },
        onError: (error: unknown) => {
            enqueueSnackbar(`Error = ${error as string}`, { variant: "error" });
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
