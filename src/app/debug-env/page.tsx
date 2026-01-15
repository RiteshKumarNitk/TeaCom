import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { Database } from "@/types/database.types";

export default async function DebugPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div>Not logged in</div>;
    }

    const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const profile = data as Database['public']['Tables']['profiles']['Row'] | null;

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-4 font-mono text-sm">
            <h1 className="text-xl font-bold">Debug Info</h1>
            <div className="bg-muted p-4 rounded border">
                <p><strong>Auth User ID:</strong> {user.id}</p>
                <p><strong>Auth Email:</strong> {user.email}</p>
                <hr className="my-2" />
                <p><strong>Profile ID:</strong> {profile?.id}</p>
                <p><strong>Profile Email:</strong> {profile?.email}</p>
                <p><strong>Profile Role:</strong> <span className="bg-yellow-200 px-1">{profile?.role}</span></p>
            </div>

            <p className="text-muted-foreground">
                If Role is "customer", the SQL update did not work.
                Please run the improved SQL script provided.
            </p>
        </div>
    );
}
