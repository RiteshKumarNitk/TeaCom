import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";


export default async function SettingsPage() {
    // Only Super Admins can manage settings
    await requireAdmin("manage_settings");

    const supabase = await createClient();

    // Fetch current settings
    const { data: settings } = await supabase
        .from("platform_settings")
        .select("*")
        .single();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold">Platform Settings</h1>
                <p className="text-muted-foreground">Global configuration for your store.</p>
            </div>

            <div className="max-w-2xl">
                <SettingsForm initialData={settings} />
            </div>
        </div>
    );
}
