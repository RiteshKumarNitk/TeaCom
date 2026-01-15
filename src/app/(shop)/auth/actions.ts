"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import { z } from "zod";

const authSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const data = Object.fromEntries(formData);
    // For login, we only validate email and password
    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
    });

    const parsed = loginSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid email or password format." };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
    });

    if (error) {
        return { error: error.message };
    }

    // Check for admin role to redirect appropriately
    const { getAdminRole } = await import("@/lib/admin/auth");
    const role = await getAdminRole();

    revalidatePath("/", "layout");

    if (role && ["super_admin", "admin", "operations", "content_manager", "support_agent"].includes(role)) {
        redirect("/admin");
    }

    redirect("/");
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const data = Object.fromEntries(formData);
    const parsed = authSchema.safeParse(data);

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
            data: {
                full_name: parsed.data.name,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    redirect("/signup/success");
}

export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}
