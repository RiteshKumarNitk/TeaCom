import Link from "next/link";
import { format } from "date-fns";
import { Database } from "@/types/database.types";

export const revalidate = 60; // ISR

export default async function BlogPage() {
    const { createClient } = await import("@/lib/supabase/server");
    const sb = await createClient();

    const { data } = await sb
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

    const posts = data as Database["public"]["Tables"]["posts"]["Row"][] | null;

    return (
        <div className="container mx-auto px-4 py-24">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-primary font-medium tracking-wider uppercase text-sm">Our Journal</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mt-3 mb-6">Tea & Wellness</h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    Discover the art of tea brewing, health benefits, and stories from our tea gardens.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts?.map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                        {/* Placeholder Image if no cover_image */}
                        <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                            {/* In real app, optimize images. */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4 text-white font-medium drop-shadow-md">
                                {/* Category could go here */}
                            </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                                {post.published_at && format(new Date(post.published_at), 'MMMM d, yyyy')}
                                <span>•</span>
                                <span>5 min read</span>
                            </div>
                            <h2 className="text-xl font-bold font-serif mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                            </h2>
                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                {post.excerpt || "Read more about this topic..."}
                            </p>
                            <span className="text-primary font-medium text-sm inline-flex items-center">
                                Read Article &rarr;
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {(!posts || posts.length === 0) && (
                <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
                    <p className="text-muted-foreground">No articles published yet. Check back soon!</p>
                </div>
            )}
        </div>
    );
}
