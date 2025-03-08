/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useDropzone } from "react-dropzone";
import { ProductImage } from "@prisma/client";
import { Upload, Trash2 } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductImageManagerProps {
    productId: number;
    initialImages?: ProductImage[];
}

const ProductImageManager: React.FC<ProductImageManagerProps> = ({ productId, initialImages = [] }) => {
    const router = useRouter();
    const { mutateAsync: uploadImage, isPending: uploadImagePending, error: uploadImageError } = api.product.uploadImage.useMutation();

    const deleteMutation = api.product.deleteImage.useMutation({
        onSuccess: async () => {
            router.refresh();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    // Dropzone configuration
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif"],
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        onDrop: (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                const fileName = `product-images/${Date.now()}-${file.name}`;

                void (async () => {
                    try {
                        await uploadImage({
                            file: base64.split(",")[1]!, // Remove the data URL prefix
                            fileName,
                            contentType: file.type,
                            productId,
                        });

                        router.refresh();
                        toast.success("Image uploaded successfully");
                    } catch (error) {
                        toast.error(`Error - ${error as string}`);
                    }
                })();
            };

            reader.readAsDataURL(file);
        },
    });

    return (
        <div className="space-y-6">
            {/* Upload Area */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-default-500" />
                    <p className="text-default-600">{isDragActive ? "Drop the images here" : "Drag & drop images or click to upload"}</p>
                    <p className="text-sm text-default-400">(Max 5MB, JPG/PNG/GIF only)</p>
                    {/* Upload progress */}
                    {uploadImagePending && (
                        <div className="mb-4">
                            <div className="w-full bg-default-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${52}%` }}></div>
                            </div>
                            <p className="text-sm text-blue-500 mt-1">Uploading...</p>
                        </div>
                    )}
                    {uploadImageError && <p className="text-red-500">Error: {uploadImageError.message}</p>}
                </div>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {initialImages.map((image: ProductImage, idx: number) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <img src={image.url} alt={`Product image ${image.id}`} className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <button
                                onClick={() => deleteMutation.mutate({ id: image.id })}
                                className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                disabled={deleteMutation.isPending}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        {deleteMutation.isPending && deleteMutation.variables?.id === image.id && (
                            <div className="absolute inset-0 bg-default-500 bg-opacity-50 flex items-center justify-center">
                                <span className="text-white">Deleting...</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {initialImages.length === 0 && <p className="text-center text-default-500">No images uploaded yet</p>}

            {/* Help text */}
            <div className="text-xs text-default-500">
                <p>• The primary image will be displayed first in the product listing</p>
                <p>• Recommended image size: 1000 x 1000 pixels</p>
            </div>
        </div>
    );
};

export default ProductImageManager;
