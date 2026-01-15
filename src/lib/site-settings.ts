import { createClient } from "@/lib/supabase/server";

export async function getSiteSettings() {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("*");

    if (!data) return {};

    // Transform array to object
    const settings: Record<string, any> = {};
    data.forEach((item) => {
        settings[item.key] = item.value;
    });

    return settings;
}

export async function getPartners() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
    return data || [];
}
