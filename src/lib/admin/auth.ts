import { getSession } from "./session";
import { redirect } from "next/navigation";
import { AdminRole, Permission, PERMISSIONS } from "@/types/admin";

export async function getAdminRole(): Promise<AdminRole | null> {
    const session = await getSession();

    if (!session || !session.admin) {
        console.log("[AdminAuth] No active admin session found.");
        return null;
    }

    const { email, role } = session.admin;
    console.log(`[AdminAuth] Verified session for Admin: ${email} (${role})`);

    return role as AdminRole;
}

export async function requireAdmin(requiredPermission: Permission) {
    console.log(`[AdminAuth] Verifying permission: '${requiredPermission}'`);
    const role = await getAdminRole();

    if (!role) {
        console.log("[AdminAuth] Access denied: No admin session. Redirecting to admin login.");
        redirect("/admin/login");
    }

    const allowedRoles = PERMISSIONS[requiredPermission] as readonly string[];
    console.log(`[AdminAuth] Current Role: ${role}. Required one of: [${allowedRoles.join(", ")}]`);

    if (!allowedRoles.includes(role)) {
        console.log("[AdminAuth] Access denied: Role not authorized.");
        redirect("/admin?error=access_denied");
    }

    console.log("[AdminAuth] Access granted.");
    return role;
}
