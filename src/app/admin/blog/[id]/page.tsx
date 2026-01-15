import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PostEditor from "../post-editor";

interface EditPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (!post) {
        notFound();
        return null; // TS Check
    }

    return <PostEditor post={post} />;
}
