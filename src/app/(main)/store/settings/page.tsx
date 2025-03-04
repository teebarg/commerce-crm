"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer";

export default function Settings() {
    return (
        <div className="p-8 h-full">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <div className="space-y-6">
                {/* Company Information */}
                <div className="bg-content1 rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Company Information</h2>
                    <div className="space-y-4">
                        <Input type="text" label="Company Name" className="max-w-sm" placeholder="Enter company name" />
                        <Input type="email" label="Company Name" className="max-w-sm" placeholder="Enter email address" />
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-content1 rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium">Email Notifications</h3>
                                <p className="text-sm text-default-500">Receive email updates about your account</p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </div>

                {/* Payment Settings */}
                <div className="bg-content1 rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Payment Settings</h2>
                    <Select>
                        <SelectTrigger className="max-w-sm">
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Default Currency</SelectLabel>
                                {[
                                    { value: "USD", label: "USD - US Dollar" },
                                    { value: "EUR", label: "EUR - Euro" },
                                    { value: "NGN", label: "NGN - Naira" },
                                ].map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button variant="primary">Save Changes</Button>
                </div>
            </div>
            <Drawer>
                <DrawerTrigger className="px-4 py-2 bg-purple-500 text-white rounded-md">Open Form</DrawerTrigger>
                <DrawerContent className="p-4">
                    <DrawerHeader>
                        <DrawerTitle>Enter Your Name</DrawerTitle>
                        <DrawerDescription>Please enter your name below.</DrawerDescription>
                    </DrawerHeader>
                    <input type="text" className="w-full p-2 border rounded-md mt-2" placeholder="Your Name" />
                    <DrawerFooter>
                        <DrawerClose className="px-4 py-2 bg-gray-200 rounded-md">Cancel</DrawerClose>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => alert(`Hello, ${name}!`)}>
                            Submit
                        </button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Drawer direction="right">
                <DrawerTrigger className="px-4 py-2 bg-green-500 text-white rounded-md">Open Drawer</DrawerTrigger>
                <DrawerContent direction="right" className="p-4">
                    <DrawerHeader>
                        <DrawerTitle>Confirm Action</DrawerTitle>
                        <DrawerDescription>Are you sure you want to proceed?</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <DrawerClose className="px-4 py-2 bg-gray-200 rounded-md">Cancel</DrawerClose>
                        <button className="px-4 py-2 bg-red-500 text-white rounded-md">Proceed</button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
