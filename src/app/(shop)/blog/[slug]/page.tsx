import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Database } from "@/types/database.types";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    const post = data as Database["public"]["Tables"]["posts"]["Row"] | null;

    if (!post) {
        notFound();
    }

    return (
        <article className="container mx-auto px-4 py-24 max-w-3xl">
            <Button variant="ghost" size="sm" asChild className="mb-8">
                <Link href="/blog">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back to Journal
                </Link>
            </Button>

            <header className="mb-12 text-center">
                <div className="text-sm text-muted-foreground mb-4">
                    {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
                    <span className="mx-2">•</span>
                    <span>By {post.author || 'Admin'}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                    {post.title}
                </h1>
                {post.excerpt && (
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {post.excerpt}
                    </p>
                )}
            </header>

            {/* Content Renderer (Basic Markdown/HTML support for MVP) */}
            <div className="prose prose-lg dark:prose-invert mx-auto">
                {/* 
                   In a real app, use a markdown parser like 'react-markdown' or 'markdown-to-jsx'. 
                   For MVP, we'll strip or display raw text if simple, or assume it's pre-formatted.
                   If we used a wysiwyg that saves HTML, we'd use dangerouslySetInnerHTML (carefully).
                   Here we just display it as whitespace-pre-wrap for basic text editing.
                */}
                <div className="whitespace-pre-wrap font-serif leading-loose text-lg">
                    {post.content}
                </div>
            </div>
        </article>
    );
}
