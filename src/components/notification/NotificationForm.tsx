"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye } from "nui-react-icons";
import { useState } from "react";
import { type NotificationPreview } from "@/types/generic";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NotificationFormProps {
    onPreview: (preview: NotificationPreview) => void;
}

export function NotificationForm({ onPreview }: NotificationFormProps) {
    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");
    const [icon, setIcon] = useState<string>("");
    const [value, setValue] = useState<string>("");

    const handlePreview = () => {
        onPreview({ title, body, icon });
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className="max-w-sm"
                    type="text"
                    label="Title"
                    placeholder="Notification Title"
                />
                <Input
                    value={icon}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIcon(e.target.value)}
                    className="max-w-sm"
                    type="text"
                    label="Icon (emoji or URL)"
                    placeholder="🔔"
                />
            </div>
            <div>
                <label>Message</label>
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Notification message..."
                    className="w-full h-32 p-4 border border-default-200 rounded-lg focus:ring-1 focus:ring-blue-50 focus:border-transparent resize-none"
                />
            </div>

            <Select value={value} onValueChange={(e: string) => setValue(e)}>
                <SelectTrigger className="max-w-sm">
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        <SelectItem value="option1">React</SelectItem>
                        <SelectItem value="option2">Python</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button className="min-w-24" color="primary" onClick={handlePreview} leftIcon={<Eye className="h-4 w-4" />}>
                Preview
            </Button>
        </div>
    );
}
