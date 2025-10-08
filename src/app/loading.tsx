import React from "react";

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-700">
            <div className="text-center">
                <div className="mb-8 flex items-center justify-center">
                    <div className="w-24 h-24 bg-linear-to-br from-neutral-300 to-neutral-600 dark:from-neutral-600 dark:to-neutral-400 rounded-full shadow-2xl flex items-center justify-center">
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-br from-neutral-700 to-neutral-900 dark:from-neutral-200 dark:to-neutral-100">
                            M
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-light">Loading your experience</h2>
                    <p className="text-muted-foreground">Preparing your personalized experience</p>
                </div>
            </div>
        </div>
    );
};

export default Loader;
