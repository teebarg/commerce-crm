"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ExtendedUser } from "@/types/generic";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Role, Status } from "@prisma/client";

const formSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email(),
    role: z.nativeEnum(Role).default("CUSTOMER"),
    status: z.nativeEnum(Status).default("PENDING"),
});

const UserForm: React.FC<{ user?: ExtendedUser; onClose: () => void }> = ({ user, onClose }) => {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            role: user?.role || Role.CUSTOMER,
            status: user?.status || Status.PENDING,
        },
    });

    const createMutation = api.user.create.useMutation({
        onSuccess: async () => {
            toast.success(`User created successfully`);
            router.refresh();
            onClose?.();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    const updateMutation = api.user.update.useMutation({
        onSuccess: async () => {
            toast.success(`User updated successfully`);
            router.refresh();
            onClose?.();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (user?.id) {
            updateMutation.mutate({ ...values, id: user.id });
        } else {
            createMutation.mutate({ ...values });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-full min-w-[32rem]">
                <div className="rounded-lg shadow-xl w-full">
                    {/* User Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>FirstName</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter firstname" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>LastName</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter lastName" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E.g email@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={Status.ACTIVE}>Active</SelectItem>
                                                <SelectItem value={Status.INACTIVE}>Inactive</SelectItem>
                                                <SelectItem value={Status.PENDING}>Pending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                                <SelectItem value={Role.CUSTOMER}>Customer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2 justify-end col-span-2 mt-4">
                            <Button variant="destructive" type="button" onClick={() => onClose()}>
                                Close
                            </Button>
                            <Button
                                isLoading={createMutation.isPending || updateMutation.isPending}
                                type="submit"
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                {user?.id ? "Update" : "Create"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default UserForm;
