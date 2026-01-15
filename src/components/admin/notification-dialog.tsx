
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SendNotificationDialog() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSend = async () => {
        if (!title || !message) return;

        startTransition(async () => {
            const supabase = createClient();

            // Broadcast message (user_id is null)
            const { error } = await supabase
                .from("notifications")
                .insert({
                    title,
                    message,
                    type: "info",
                    user_id: null // Broadcast
                });

            if (error) {
                alert("Failed to send notification: " + error.message);
            } else {
                setOpen(false);
                setTitle("");
                setMessage("");
                alert("Notification broadcasted successfully!");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Bell className="w-4 h-4" />
                    Broadcast Message
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Broadcast Notification</DialogTitle>
                    <DialogDescription>
                        Send a message to all users.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Sale Alert!"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Our big sale starts tomorrow..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSend} disabled={isPending}>
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                        Send Broadcast
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
