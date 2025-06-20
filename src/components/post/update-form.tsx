"use client";

import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { PostSchema } from "@/schemas/post.schema";
import { api } from "@/trpc/react";
// import { PostSchema } from "@/trpc/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Post } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Calendar } from "nui-react-icons";
import type React from "react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

interface Props {
    current?: Post;
    type?: "create" | "update";
    onClose?: () => void;
}

const UpdatePost: React.FC<Props> = ({ current }) => {
    const router = useRouter();
    const utils = api.useUtils();

    const update = api.post.update.useMutation({
        onSuccess: async () => {
            toast.success("Post updated successfully");
            await utils.post.invalidate();
            router.refresh();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });
    const [scheduledFor, setScheduledFor] = useState<Date | undefined>(current?.scheduledTime ? new Date(current.scheduledTime) : undefined);
    const [isScheduling, setIsScheduling] = useState<boolean>(!!current?.scheduledTime);

    const formRef = useRef<HTMLFormElement>(null);

    type Form = z.infer<typeof PostSchema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Form>({
        resolver: zodResolver(PostSchema),
        defaultValues: {
            content: current?.content,
            title: current?.title,
        },
    });

    interface UpdateData extends Form {
        id: Post["id"];
        scheduledAt: Date | null;
    }

    const onSubmit = (data: Form): void => {
        if (!current) return;
        const updateData: UpdateData = { ...data, id: current.id, scheduledAt: scheduledFor };
        update.mutate(updateData);
    };

    return (
        <div className="bg-content1 rounded-xl shadow-xs py-6 px-2">
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <Input
                        className="max-w-sm"
                        type="text"
                        label="Title"
                        placeholder="Title"
                        {...register("title", { required: "Title is required" })}
                        error={errors?.title?.message}
                    />
                    <div>
                        <textarea
                            {...register("content", { required: "Content is required" })}
                            placeholder="What's on your mind?"
                            className="w-full h-32 p-4 border border-default-200 rounded-lg focus:ring-1 focus:ring-blue-50 focus:border-transparent resize-none"
                        />
                        {errors?.content && <p className="text-xs text-rose-500 mt-0.5">{errors?.content?.message}</p>}
                    </div>
                    <div className="flex w-full">
                        <button
                            type="button"
                            onClick={() => setIsScheduling(!isScheduling)}
                            className={`p-2 rounded-full transition-colors ml-auto ${
                                isScheduling ? "bg-purple-100 text-purple-600" : "hover:bg-default-100 text-default-600"
                            }`}
                        >
                            <Calendar className="w-6 h-6" viewBox="0 0 20 20" />
                        </button>
                    </div>

                    {isScheduling && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-default-600">Schedule for:</span>
                            <DateTimePicker value={scheduledFor} onChange={setScheduledFor} minDate={new Date()} />
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" isLoading={update.isPending} disabled={update.isPending} variant="primary" className="px-4 py-2">
                            Update
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export { UpdatePost };
