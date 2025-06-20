import { useState } from "react";
import { Calendar, Clock, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ContentCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Sample scheduled posts
    const scheduledPosts = [
        {
            id: 1,
            date: "2024-01-15",
            time: "09:00",
            platform: "Instagram",
            content: "Morning motivation: Start your week strong! 💪 #MondayMotivation",
            status: "scheduled",
            color: "bg-pink-500",
        },
        {
            id: 2,
            date: "2024-01-15",
            time: "15:00",
            platform: "Twitter",
            content: "Behind the scenes of our latest project. Innovation never stops! 🚀",
            status: "scheduled",
            color: "bg-blue-500",
        },
        {
            id: 3,
            date: "2024-01-16",
            time: "12:00",
            platform: "Facebook",
            content: "Sharing insights from our recent team meeting. Growth mindset is key! 📈",
            status: "scheduled",
            color: "bg-blue-600",
        },
        {
            id: 4,
            date: "2024-01-17",
            time: "18:00",
            platform: "Instagram",
            content: "Sunset vibes and positive thoughts. What makes you grateful today? 🌅",
            status: "published",
            color: "bg-pink-500",
        },
    ];

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const getPostsForDate = (day: number) => {
        if (!day) return [];
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return scheduledPosts.filter((post) => post.date === dateString);
    };

    const navigateMonth = (direction: "prev" | "next") => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            if (direction === "prev") {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="space-y-6">
            {/* Calendar Header */}
            <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-purple-600" />
                                Content Calendar
                            </CardTitle>
                            <CardDescription>View and manage your scheduled posts</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="px-4 py-2 gradient-blue rounded-lg font-semibold">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Calendar Grid */}
                <div className="xl:col-span-3">
                    <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                        <CardContent className="p-6">
                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {dayNames.map((day) => (
                                    <div key={day} className="p-2 text-center font-semibold text-gray-600 text-sm">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Days */}
                            <div className="grid grid-cols-7 gap-2">
                                {getDaysInMonth(currentDate).map((day, index) => {
                                    const postsForDay = day ? getPostsForDate(day) : [];
                                    const isToday =
                                        day &&
                                        new Date().getDate() === day &&
                                        new Date().getMonth() === currentDate.getMonth() &&
                                        new Date().getFullYear() === currentDate.getFullYear();

                                    return (
                                        <div
                                            key={index}
                                            className={`min-h-[100px] p-2 border rounded-lg ${
                                                day ? "bg-white hover:bg-gray-50 cursor-pointer" : "bg-gray-50"
                                            } ${isToday ? "ring-2 ring-purple-500" : ""}`}
                                        >
                                            {day && (
                                                <>
                                                    <div className={`text-sm font-semibold mb-1 ${isToday ? "text-purple-600" : "text-gray-700"}`}>
                                                        {day}
                                                    </div>
                                                    <div className="space-y-1">
                                                        {postsForDay.slice(0, 2).map((post) => (
                                                            <div key={post.id} className={`text-xs p-1 rounded text-white ${post.color} truncate`}>
                                                                {post.time} - {post.platform}
                                                            </div>
                                                        ))}
                                                        {postsForDay.length > 2 && (
                                                            <div className="text-xs text-gray-500">+{postsForDay.length - 2} more</div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Upcoming Posts Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-white/80 backdrop-blur-md border-0 shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-600" />
                                Upcoming Posts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {scheduledPosts
                                .filter((post) => post.status === "scheduled")
                                .slice(0, 5)
                                .map((post) => (
                                    <div key={post.id} className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="secondary" className={`${post.color} text-white`}>
                                                {post.platform}
                                            </Badge>
                                            <div className="flex items-center space-x-1">
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-3 w-3" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button variant="ghost" size="sm">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.content}</p>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {post.date} at {post.time}
                                        </div>
                                    </div>
                                ))}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                        <CardHeader>
                            <CardTitle className="text-sm opacity-90">This Week</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8 Posts</div>
                            <p className="text-xs opacity-90">3 published, 5 scheduled</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContentCalendar;
