"use client";

import { useActionState } from "react";
import { updateSettings, SettingsState } from "./actions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";

export function SettingsForm({ initialData }: { initialData: any }) {
    const [state, formAction, isPending] = useActionState(updateSettings, {});

    if (state.success) {
        // We can't use toast here properly without a provider, 
        // but assuming it's available in layout or we use a simpler notification if not.
    }

    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>General Store Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {state.error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-100">
                            {state.error}
                        </div>
                    )}
                    {state.success && (
                        <div className="p-3 bg-green-50 text-green-600 rounded-md text-sm border border-green-100">
                            Settings saved successfully!
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input
                            id="storeName"
                            name="storeName"
                            defaultValue={initialData?.store_name || "TeaCom Premium"}
                            placeholder="e.g. TeaCom Global"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">Support Email</Label>
                        <Input
                            id="contactEmail"
                            name="contactEmail"
                            type="email"
                            defaultValue={initialData?.contact_email || "support@teacom.com"}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency">Default Currency</Label>
                        <Select name="currency" defaultValue={initialData?.currency || "INR"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                                <SelectItem value="USD">US Dollar ($)</SelectItem>
                                <SelectItem value="GBP">British Pound (£)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-0.5">
                            <Label>Maintenance Mode</Label>
                            <p className="text-xs text-gray-500">Temporarily disable the storefront for customers.</p>
                        </div>
                        <Switch
                            name="maintenanceMode"
                            defaultChecked={initialData?.maintenance_mode}
                        />
                    </div>
                </CardContent>
                <CardFooter className="bg-gray-50/50 border-t px-6 py-4">
                    <Button type="submit" className="ml-auto gap-2" disabled={isPending}>
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
