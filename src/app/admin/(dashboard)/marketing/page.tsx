import { requireAdmin } from "@/lib/admin/auth";
import { Megaphone, Mail, Send, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function MarketingPage() {
    // Content Managers, Admins, and Super Admins
    await requireAdmin("manage_marketing");

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
                        <Megaphone className="w-8 h-8 text-primary" />
                        Marketing & Campaigns
                    </h1>
                    <p className="text-muted-foreground">Manage your customer outreach and email newsletters.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Send className="w-5 h-5" />
                            New Campaign
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-500">Create and send a new email broadcast to your registered customers.</p>
                        <Button className="w-full">Create Broadcast</Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="w-5 h-5" />
                            Campaign History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-500">Review analytics and delivery status of your previous marketing efforts.</p>
                        <Button variant="outline" className="w-full">View History</Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-primary/5 border-none">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900">Email System Active</h4>
                            <p className="text-sm text-gray-600">Your Resend integration is configured and ready for production campaigns.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
