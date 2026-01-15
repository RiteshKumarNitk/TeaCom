import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database.types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit, Eye } from "lucide-react";

export default async function AdminBlogPage() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

    const posts = data as Database["public"]["Tables"]["posts"]["Row"][] | null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold">Blog Posts</h1>
                    <p className="text-muted-foreground">Manage your articles and content.</p>
                </div>
                <Button asChild>
                    <Link href="/admin/blog/new">
                        <Plus className="w-4 h-4 mr-2" /> New Post
                    </Link>
                </Button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border">
                        <tr>
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Published</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {posts?.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                                    No posts found. Create your first one!
                                </td>
                            </tr>
                        ) : (
                            posts?.map((post) => (
                                <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-medium">{post.title}</td>
                                    <td className="px-6 py-4">
                                        {post.is_published ? (
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {post.published_at ? new Date(post.published_at).toLocaleDateString() : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                <Eye className="w-4 h-4 text-muted-foreground" />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/admin/blog/${post.id}`}>
                                                <Edit className="w-4 h-4 text-primary" />
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
