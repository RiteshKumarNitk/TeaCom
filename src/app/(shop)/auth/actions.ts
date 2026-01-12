"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import { z } from "zod";

const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const data = Object.fromEntries(formData);
    const parsed = authSchema.safeParse(data);

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

    revalidatePath("/", "layout");
    redirect("/");
}

export async function signup(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const data = Object.fromEntries(formData);
    const parsed = authSchema.safeParse(data);

    if (!parsed.success) {
        return { error: "Invalid email or password format." };
    }

    const { error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
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
