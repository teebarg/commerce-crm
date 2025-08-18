import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
    title?: string;
    content?: string;
    onConfirm?: () => void;
    onClose?: () => void;
    isLoading?: boolean;
}

const Confirm: React.FC<Props> = ({ title = "Confirm?", content, onConfirm, onClose, isLoading = false }) => {
    const onSubmit = async () => {
        onConfirm?.();
    };

    return (
        <div className="mx-auto w-full">
            <div className="pb-4 flex items-center justify-between border-b border-input bg-card">
                <div className="flex">
                    <h2 className="text-xl font-semibold leading-6 text-default-900">{title}</h2>
                </div>
            </div>
            <div>
                <p className="text-sm text-default-700 mt-6 font-medium">
                    {content ??
                        "Are you sure you want to delete this item? All of your data will be permanently removed from our servers forever. This action cannot be undone."}
                </p>
            </div>
            <div className="flex justify-end gap-2 mt-8">
                <Button variant="outline" onClick={onClose}>
                    Close
                </Button>
                <Button isLoading={isLoading} variant="destructive" type="submit" onClick={onSubmit}>
                    Delete
                </Button>
            </div>
        </div>
    );
};

export { Confirm };
