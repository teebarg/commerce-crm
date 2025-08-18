import { Edit, Trash2, Copy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { api } from "@/trpc/react";
import { type NotificationTemplate } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { Confirm } from "@/components/ui/confirm";
import Overlay from "@/components/overlay";
import { TemplateForm } from "./template-form";
import UseTemplateForm from "./use-template-form";

interface NotificationTemplateItemProps {
    template: NotificationTemplate;
}

const NotificationTemplateItem: React.FC<NotificationTemplateItemProps> = ({ template }) => {
    const deleteState = useOverlayTriggerState({});
    const editState = useOverlayTriggerState({});
    const useTemplateState = useOverlayTriggerState({});
    const utils = api.useUtils();

    const deleteMutation = api.push.deleteTemplate.useMutation({
        onSuccess: async () => {
            toast.success("Notification Deleted", {
                description: "The notification has been removed from your history.",
            });
            await utils.push.invalidate();
            deleteState.close();
        },
        onError: (error: unknown) => {
            toast.error(`Error - ${error as string}`);
        },
    });



    const handleCopyTemplate = (template: NotificationTemplate) => {
        toast.success("Template Copied", {
            description: `"${template.title}" template has been duplicated.`,
        });
    };

    return (
        <Card key={template.id} className="relative">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{template.code}</CardTitle>
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                        {template.category}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-default-50 rounded-lg p-3">
                    <h4 className="font-medium text-sm mb-1">{template.title}</h4>
                    <p className="text-sm text-default-500">{template.body}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-default-500">
                    <span>Created {formatDate(template.createdAt)}</span>
                </div>

                <div className="flex gap-2">
                    <Overlay
                        open={useTemplateState.isOpen}
                        title={`Use Template: ${template.title}`}
                        trigger={
                            <Button className="flex-1">
                                Use Template
                            </Button>
                        }
                        onOpenChange={useTemplateState.setOpen}
                        sheetClassName="min-w-[40vw]"
                    >
                        <UseTemplateForm template={template} onClose={useTemplateState.close} />
                    </Overlay>
                    <Button variant="outline" size="icon" onClick={() => handleCopyTemplate(template)}>
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Overlay
                        open={editState.isOpen}
                        title={`Edit ${template.title}`}
                        trigger={
                            <Button size="icon" variant="outline">
                                <Edit className="h-4 w-4" />
                            </Button>
                        }
                        onOpenChange={editState.setOpen}
                    >
                        <TemplateForm template={template} mode="update" onClose={editState.close} />
                    </Overlay>
                    <Dialog open={deleteState.isOpen} onOpenChange={deleteState.setOpen}>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="outline" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader className="sr-only">
                                <DialogTitle>{`Delete ${template.title}`}</DialogTitle>
                            </DialogHeader>
                            <Confirm
                                onClose={deleteState.close}
                                onConfirm={() => void deleteMutation.mutate(template.id)}
                                isLoading={deleteMutation.isPending}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
};

export default NotificationTemplateItem;
