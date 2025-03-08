"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import DrawerUI from "@/components/drawer";
import { useOverlayTriggerState } from "react-stately";
import { ExtendedUser } from "@/types/generic";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import UserForm from "./user-form";

interface UserActionsProps {
    user: ExtendedUser;
}

export function UserActions({ user }: UserActionsProps) {
    const viewState = useOverlayTriggerState({});
    const router = useRouter();

    const deleteMutation = api.user.delete.useMutation({
        onSuccess: async () => {
            router.refresh();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    return (
        <div className="flex justify-end">
            <DrawerUI
                open={viewState.isOpen}
                onOpenChange={viewState.setOpen}
                direction="right"
                title={`Edit User`}
                trigger={
                    <Button asChild variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                    </Button>
                }
            >
                <UserForm onClose={viewState.close} user={user} />
            </DrawerUI>
            <Button onClick={() => deleteMutation.mutate(user.id)} variant="ghost" size="icon">
                <Trash2 className="text-rose-600 h-4 w-4" />
            </Button>
        </div>
    );
}
