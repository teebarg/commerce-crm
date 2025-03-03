import React, { useState } from "react";
import { Button } from "./button";

interface Props {
    title?: string;
    content?: string;
    onConfirm?: () => void;
    onClose?: () => void;
}

const Confirm: React.FC<Props> = ({ title = "Confirm?", content, onConfirm, onClose }) => {
    const [isPending, setIsPending] = useState<boolean>(false);

    const onSubmit = async () => {
        setIsPending(true);
        onConfirm?.();
    };

    return (
        <React.Fragment>
            <div className="mx-auto w-full p-8">
                <div>
                    <div className="pb-4 flex items-center justify-between border-b border-black/10 dark:border-white/10">
                        <div className="flex">
                            <h2 className="text-xl font-semibold leading-6 text-gray-100">{title}</h2>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 mt-6 font-medium">
                            {content ??
                                "Are you sure you want to delete this item? All of your data will be permanently removed from our servers forever. This action cannot be undone."}
                        </p>
                    </div>
                    <div className="flex justify-end gap-2 mt-8">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <Button isLoading={isPending} variant="danger" type="submit" onClick={onSubmit}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export { Confirm };
