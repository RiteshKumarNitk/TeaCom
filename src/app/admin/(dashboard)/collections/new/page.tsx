"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createCollection } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Collection"}
        </Button>
    );
}

const initialState = {
    error: "",
    success: false
};

export default function NewCollectionPage() {
    const [state, formAction] = useActionState(createCollection, initialState);

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/collections">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-serif font-bold tracking-tight">Create New Collection</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Collection Details</CardTitle>
                    <CardDescription>
                        Group products into featured collections or sales.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="e.g. Summer Essentials"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    placeholder="e.g. summer-essentials"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Select name="type" defaultValue="standard">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="standard">Standard</SelectItem>
                                        <SelectItem value="seasonal">Seasonal</SelectItem>
                                        <SelectItem value="featured">Featured</SelectItem>
                                        <SelectItem value="sale">Sale</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Description..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="starts_at">Starts At</Label>
                                    <Input
                                        id="starts_at"
                                        name="starts_at"
                                        type="datetime-local"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="ends_at">Ends At</Label>
                                    <Input
                                        id="ends_at"
                                        name="ends_at"
                                        type="datetime-local"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="is_active" name="is_active" defaultChecked />
                                <Label htmlFor="is_active">Active immediately</Label>
                            </div>
                        </div>

                        {state?.error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                                {state.error}
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <Link href="/admin/collections">
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                            <SubmitButton />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
