"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Excel } from "nui-react-icons";
import { File, X } from "lucide-react";

type FileData = {
    name: string;
    size: number;
    type: string;
    progress: number;
};

export default function FileUpload() {
    const [file, setFile] = useState<FileData | null>(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const selectedFile = event.dataTransfer.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };

    const processFile = (selectedFile: File) => {
        if (
            !["text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(selectedFile.type)
        ) {
            alert("Invalid file type. Only CSV, XLSX, and XLS files are allowed.");
            return;
        }
        if (selectedFile.size > 10 * 1024 * 1024) {
            alert("File size exceeds the 10MB limit.");
            return;
        }

        setFile({
            name: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
            progress: 0,
        });

        simulateUpload();
    };

    const simulateUpload = () => {
        let progressValue = 0;
        const interval = setInterval(() => {
            progressValue += 10;
            setProgress(progressValue);
            if (progressValue >= 100) clearInterval(interval);
        }, 500);
    };

    const removeFile = () => {
        setFile(null);
        setProgress(0);
    };

    return (
        <div className="sm:mx-auto sm:max-w-lg">
            <form>
                <h3 className="font-semibold">File Upload</h3>
                <div
                    className="mt-4 flex justify-center rounded-lg border border-dashed border-indigo-500 px-6 py-20"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <div>
                        <File className="mx-auto h-12 w-12 text-default-500" aria-hidden />
                        <div className="mt-4 flex leading-6 text-default-500">
                            <p>Drag and drop or</p>
                            <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-sm pl-1 font-medium text-card hover:underline hover:underline-offset-4"
                            >
                                <span>choose file</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    accept=".csv, .xlsx, .xls"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <p className="pl-1">to upload</p>
                        </div>
                    </div>
                </div>
                <p className="mt-2 leading-5 text-gray-500 sm:flex sm:items-center sm:justify-between">
                    <span>Accepted file types: CSV, XLSX or XLS files.</span>
                    <span className="pl-1 sm:pl-0">Max. size: 10MB</span>
                </p>
                {file && (
                    <div className="relative mt-8 rounded-lg bg-card p-4">
                        <div className="absolute right-1 top-1">
                            <button
                                type="button"
                                className="rounded-sm p-2 text-default-500 hover:text-default-600"
                                aria-label="Remove"
                                onClick={removeFile}
                            >
                                <X className="size-5 shrink-0" aria-hidden />
                            </button>
                        </div>
                        <div className="flex items-center space-x-2.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background ring-1">
                                <Excel className="size-5 text-default-700" aria-hidden />
                            </span>
                            <div>
                                <p className="font-semibold">{file.name}</p>
                                <p className="mt-0.5">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center space-x-3">
                            <Progress value={progress} className="[&>*]:h-1.5" />
                            <span className="">{progress}%</span>
                        </div>
                    </div>
                )}
                <div className="mt-8 flex items-center justify-end space-x-3">
                    <button type="button" className="rounded-sm border px-4 py-2 text-default font-medium">
                        Cancel
                    </button>
                    <button type="submit" className="rounded-sm bg-card px-4 py-2 text-default font-medium">
                        Upload
                    </button>
                </div>
            </form>
        </div>
    );
}
