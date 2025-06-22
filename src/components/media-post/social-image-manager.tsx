"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Image, X, Upload, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MediaFile {
    id: string;
    file: File;
    url: string;
    type: "IMAGE" | "VIDEO" | "GIF";
    name: string;
}

interface SocialImageManagerProps {
    onMediaChange?: (media: MediaFile[]) => void;
    maxFiles?: number;
    maxSize?: number; // in MB
}

const SocialImageManager: React.FC<SocialImageManagerProps> = ({
    onMediaChange,
    maxFiles = 5,
    maxSize = 10, // 10MB
}) => {
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (mediaFiles.length + acceptedFiles.length > maxFiles) {
                toast.error(`Maximum ${maxFiles} files allowed`);
                return;
            }

            const newMediaFiles: MediaFile[] = acceptedFiles.map((file) => {
                const fileType = getFileType(file);
                const url = URL.createObjectURL(file);

                return {
                    id: Math.random().toString(36).substr(2, 9),
                    file,
                    url,
                    type: fileType,
                    name: file.name,
                };
            });

            const updatedFiles = [...mediaFiles, ...newMediaFiles];
            setMediaFiles(updatedFiles);
            onMediaChange?.(updatedFiles);

            toast.success(`${acceptedFiles.length} file(s) uploaded successfully`);
        },
        [mediaFiles, maxFiles, onMediaChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
            "video/*": [".mp4", ".mov", ".avi", ".webm"],
        },
        maxSize: maxSize * 1024 * 1024, // Convert to bytes
        multiple: true,
    });

    const getFileType = (file: File): "IMAGE" | "VIDEO" | "GIF" => {
        if (file.type.startsWith("image/")) {
            return file.type === "image/gif" ? "GIF" : "IMAGE";
        }
        return "VIDEO";
    };

    const removeFile = (id: string) => {
        const updatedFiles = mediaFiles.filter((file) => file.id !== id);
        setMediaFiles(updatedFiles);
        onMediaChange?.(updatedFiles);
        toast.success("File removed");
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDragActive
                        ? "border-purple-400 bg-purple-50"
                        : "border-gray-300 hover:border-gray-400"
                }`}
            >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                    <p className="text-purple-600 font-medium">Drop the files here...</p>
                ) : (
                    <div>
                        <p className="text-gray-600 font-medium mb-2">
                            Drag & drop files here, or click to select
                        </p>
                        <p className="text-sm text-gray-500">
                            Supports: JPG, PNG, GIF, MP4, MOV (Max {maxSize}MB per file)
                        </p>
                    </div>
                )}
            </div>

            {/* File List */}
            {mediaFiles.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Uploaded Media</h4>
                        <Badge variant="secondary">
                            {mediaFiles.length}/{maxFiles} files
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {mediaFiles.map((file) => (
                            <Card key={file.id} className="relative group">
                                <CardContent className="p-3">
                                    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                        {file.type === "IMAGE" || file.type === "GIF" ? (
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <video
                                                src={file.url}
                                                className="w-full h-full object-cover"
                                                muted
                                            />
                                        )}

                                        {/* Remove Button */}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeFile(file.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>

                                        {/* File Type Badge */}
                                        <Badge
                                            variant="secondary"
                                            className="absolute bottom-2 left-2 text-xs"
                                        >
                                            {file.type}
                                        </Badge>
                                    </div>

                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatFileSize(file.file.size)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* Upload Progress (can be extended) */}
            {mediaFiles.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <FileImage className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No media uploaded yet</p>
                    <p className="text-sm">Upload images or videos to enhance your post</p>
                </div>
            )}
        </div>
    );
};

export default SocialImageManager;
