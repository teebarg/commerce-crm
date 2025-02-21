import { type Metadata } from "next";
import React from "react";
import { Exclamation } from "nui-react-icons";
import { BackButton } from "@/components/back";

export const metadata: Metadata = {
    title: "404",
    description: "Something went wrong",
};

const NotFound: React.FC = async () => {
    return (
        <div className="flex items-center justify-center h-screen py-12 px-4">
            <div className="max-w-md mx-auto text-center">
                <Exclamation className="w-20 h-20 mx-auto text-rose-500" />
                <h1 className="text-4xl font-bold mt-6">Oops! Page Not Found</h1>
                <p className="text-gray-500 my-4">{`The page you're looking for doesn't exist or has been moved.`}</p>
                <BackButton />
            </div>
        </div>
    );
};

export default NotFound;
