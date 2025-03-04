import React from "react";

interface Props {
    title?: string;
    content?: string;
}

const Confirm: React.FC<Props> = ({ title = "Confirm?", content }) => {
    return (
        <React.Fragment>
            <div className="mx-auto w-full p-12 h-full flex items-center justify-center">
                <div>
                    <div className="pb-4 flex items-center justify-between border-b border-black/10 dark:border-white/10">
                        <div className="flex">
                            <h2 className="text-2xl font-semibold leading-6 text-gray-100">{title}</h2>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 mt-6 font-medium text-center">
                            {content ??
                                "Are you sure you want to delete this item? All of your data will be permanently removed from our servers forever. This action cannot be undone."}
                        </p>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export { Confirm };
