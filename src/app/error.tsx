"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { BtnLink } from "@/components/ui/btnLink";


export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        if (error) {
            // Prepare the error data
            const errorData = {
                message: error.message || "An error occurred",
                name: error.name || "Error",
                stack: error.stack ?? "",
                timestamp: new Date().toISOString(),
            };

            // Send the error to the server
            fetch(`${process.env.NEXT_PUBLIC_APP_NAME}/api/log-error`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(errorData),
            }).catch((fetchError) => {
                console.error("Failed to log error:", fetchError);
            });
        }
    }, [error]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="max-w-lg mx-auto bg-card rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                    <h1 className="text-4xl font-bold mb-2">500</h1>
                    <p className="text-xl text-default-900 mb-4">Internal Server Error</p>
                    <p className="text-default-500 mb-6">Oops! Something went wrong on our end. We apologize for the inconvenience.</p>
                    <BtnLink variant="primary" href="/">
                        Go back to homepage
                    </BtnLink>
                    <Button aria-label="try again" className="block mt-6 ml-4" variant="destructive" type="button" onClick={() => reset()}>
                        Try again
                    </Button>
                </div>
                <div className="px-6 py-4 border-t border-default-100 text-sm text-default-500">
                    If the problem persists, please contact our support team.
                </div>
            </div>
        </div>
    );
}
