import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

interface LogActionParams {
    action: string;
    entityType: string;
    entityId: string;
    oldValue?: any;
    newValue?: any;
    userId?: string; // Optional: if not provided, tries to get from auth
}

export async function logAdminAction(params: LogActionParams) {
    // Fire and forget logging pattern (usually) - but awaiting here for safety
    try {
        const supabase = await createClient();
        let actorId = params.userId;

        if (!actorId) {
            const { data: { user } } = await supabase.auth.getUser();
            actorId = user?.id;
        }

        const headersList = await headers();
        // X-Forwarded-For is useful if behind a proxy like Vercel
        const ip = headersList.get("x-forwarded-for") || "unknown";
        const userAgent = headersList.get("user-agent") || "unknown";

        const { error } = await (supabase as any).from("audit_logs").insert({
            actor_id: actorId,
            action: params.action,
            entity_type: params.entityType,
            entity_id: params.entityId,
            old_value: params.oldValue ? params.oldValue : null, // Supabase expects JSON or null
            new_value: params.newValue ? params.newValue : null,
            ip_address: ip,
            user_agent: userAgent
        });

        if (error) {
            console.error("Failed to write audit log:", error);
        }
    } catch (e) {
        console.error("Error logging action:", e);
    }
}
