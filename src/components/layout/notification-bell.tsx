
"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Notification {
    id: string;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
    type: string;
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();

    const fetchNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("notifications")
            .select("*")
            .or(`user_id.eq.${user.id},user_id.is.null`)
            .order("created_at", { ascending: false })
            .limit(10);

        if (data) {
            setNotifications(data);
            // Count unread (simple approximation)
            // Realistically need a separate tracking for 'broadcast' read status per user, 
            // but for MVP we assume local storage or simple is_read for direct msgs.
            // For now, let's just count 'is_read' false.
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Subscription for realtime updates could go here
        const channel = supabase
            .channel('public:notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
                fetchNotifications();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className="p-2 hover:bg-muted rounded-full transition-colors relative group text-foreground/70 hover:text-primary">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                            {unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b border-border bg-muted/50">
                    <h4 className="font-semibold text-sm">Notifications</h4>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-border">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                                        !notification.is_read ? "bg-blue-50/50" : ""
                                    )}
                                // onClick={() => markAsRead(notification.id)} // Mark on click? or view?
                                >
                                    <div className="flex justify-between items-start gap-2 mb-1">
                                        <div className="font-medium text-sm text-foreground">{notification.title}</div>
                                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                            {format(new Date(notification.created_at), "MMM d")}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            No notifications.
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
