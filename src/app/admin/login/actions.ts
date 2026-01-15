"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { createClient } from "@/lib/supabase/server";
import { loginAdmin, logoutAdmin as sessionLogout } from "@/lib/admin/session";
import { redirect } from "next/navigation";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type State = {
    error?: string;
    success?: boolean;
};

export async function adminLogin(prevState: State, formData: FormData): Promise<State> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
        return { error: "Invalid email or password format." };
    }

    const supabase = await createClient();

    // 1. Find the admin account
    const { data: admin, error } = await supabase
        .from("admin_accounts")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !admin) {
        console.error("[AdminLogin] Admin not found or error:", error);
        return { error: "Invalid credentials." };
    }

    // 2. Verify password
    const passwordMatch = await bcrypt.compare(password, (admin as any).password_hash);
    if (!passwordMatch) {
        return { error: "Invalid credentials." };
    }

    // 3. Create Session
    await loginAdmin({
        id: (admin as any).id,
        email: (admin as any).email,
        role: (admin as any).role,
    });

    // 4. Update last login
    await (supabase.from("admin_accounts") as any)
        .update({ last_login: new Date().toISOString() })
        .eq("id", (admin as any).id);

    redirect("/admin");
}

export async function adminSignup(prevState: State, formData: FormData): Promise<State> {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
        return { error: "Invalid email or password format." };
    }

    const supabase = await createClient();

    // Check if admin already exists
    const { data: existing } = await supabase
        .from("admin_accounts")
        .select("id")
        .eq("email", email)
        .single();

    if (existing) {
        return { error: "An account with this email already exists." };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create admin
    const { data: newAdmin, error } = await (supabase.from("admin_accounts") as any)
        .insert({
            email,
            password_hash: hash,
            role: "admin", // Default role for signup
            full_name: fullName
        })
        .select()
        .single();

    if (error || !newAdmin) {
        console.error("[AdminSignup] Error:", error);
        return { error: "Failed to create account." };
    }

    // Create Session
    await loginAdmin({
        id: (newAdmin as any).id,
        email: (newAdmin as any).email,
        role: (newAdmin as any).role,
    });

    redirect("/admin");
}

export async function logoutAdmin() {
    await sessionLogout();
    redirect("/admin/login");
}

// Temporary Bootstrap Action (Run this once to create the first admin)
export async function bootstrapAdmin(password: string) {
    const supabase = await createClient();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const { error } = await supabase
        .from("admin_accounts" as any)
        .insert({
            email: "naariwearcollection@gmail.com",
            password_hash: hash,
            role: "super_admin",
            full_name: "Super Admin"
        } as any);

    if (error) {
        console.error("[Bootstrap] Error:", error);
        return { error: error.message };
    }

    return { success: true };
}
