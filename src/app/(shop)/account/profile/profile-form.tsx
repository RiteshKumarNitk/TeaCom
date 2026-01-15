"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
        </Button>
    );
}

const initialState = {
    error: "",
    success: false
};

export default function ProfilePage({ user, profile }: { user?: any, profile?: any }) {
    const [state, formAction] = useActionState(updateProfile, initialState);

    // If fetching happens in parent layout/page, we might pass it down. 
    // But since this is a page, we usually fetch here or use a client wrapper.
    // For simplicity given the limitations, let's assume valid auth wrapper or fetch in RSC wrapper.
    // Actually, I'll make this a Client Component that takes props, but I need an RSC entry point.
    // Wait, the ViewFile showed this file was empty 0 bytes.
    // I will write a Hybrid approach: RSC defaults inside.

    return (
        <div className="max-w-xl">
            <Card>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                        Update your personal information.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                defaultValue={user?.email || ""}
                                disabled
                                className="bg-muted"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                defaultValue={profile?.full_name || ""}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                defaultValue={profile?.phone || ""}
                                placeholder="+1 234 567 890"
                            />
                        </div>

                        {state?.error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                                {state.error}
                            </div>
                        )}

                        {state?.success && (
                            <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
                                Profile updated successfully.
                            </div>
                        )}

                        <div className="flex justify-end">
                            <SubmitButton />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
