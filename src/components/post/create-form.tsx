"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datepicker";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Calendar } from "nui-react-icons";
import type React from "react";
import { useRef, useState } from "react";
import { type z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { PostSchema } from "@/trpc/schema";
import { toast } from "sonner";
import { PostSchema } from "@/schemas/post.schema";

type Props = {
    onClose?: () => void;
};

const CreatePost: React.FC<Props> = ({ onClose }) => {
    const router = useRouter();
    const utils = api.useUtils();

    const mutation = api.post.create.useMutation({
        onSuccess: async () => {
            toast.success("Post created successfully");
            await utils.post.invalidate();
            if (formRef.current) {
                formRef.current.reset();
                router.refresh();
                onClose?.();
            }
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const [scheduledFor, setScheduledFor] = useState<Date>();
    const [isScheduling, setIsScheduling] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);

    type Form = z.infer<typeof PostSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Form>({
        resolver: zodResolver(PostSchema),
    });

    const onSubmit = (data: Form): void => {
        mutation.mutate({ ...data, scheduledTime: scheduledFor });
    };

    return (
        <div className="bg-content1 rounded-xl shadow-xs p-6">
            <h2 className="text-xl font-semibold text-default-800 mb-4">Create Post</h2>
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <div>
                        <textarea
                            {...register("content", { required: "Content is required" })}
                            placeholder="What's on your mind?"
                            className="w-full h-32 p-4 border border-default-200 rounded-lg focus:ring-1 focus:ring-blue-50 focus:border-transparent resize-none"
                        />
                        {errors?.content && <p className="text-xs text-rose-500 mt-0.5">{errors?.content?.message}</p>}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                type="button"
                                onClick={() => setIsScheduling(!isScheduling)}
                                className={`p-2 rounded-full transition-colors ${
                                    isScheduling ? "bg-purple-100 text-purple-600" : "hover:bg-default-100 text-default-600"
                                }`}
                            >
                                <Calendar className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {isScheduling && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-default-600">Schedule for:</span>
                            <DateTimePicker value={scheduledFor} onChange={setScheduledFor} minDate={new Date()} />
                        </div>
                    )}

                    <div className="flex justify-end gap-4">
                        <Button type="submit" isLoading={mutation.isPending} disabled={mutation.isPending} variant="primary" className="px-4 py-2">
                            Create
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export { CreatePost };
