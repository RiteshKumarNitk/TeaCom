"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Globe } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export function PostsTable() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        const { data } = await supabase
            .from("posts")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setPosts(data);
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return;
        await supabase.from("posts").delete().eq("id", id);
        fetchPosts();
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {posts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">No posts found.</TableCell>
                        </TableRow>
                    ) : (
                        posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell className="font-medium">
                                    {post.title}
                                    <div className="text-xs text-muted-foreground truncate max-w-[300px]">{post.slug}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={post.is_published ? "default" : "secondary"}>
                                        {post.is_published ? "Published" : "Draft"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/blog/${post.slug}`} target="_blank">
                                            <Button size="icon" variant="ghost" title="View Live"><Globe className="w-4 h-4" /></Button>
                                        </Link>
                                        <Link href={`/admin/content/posts/${post.id}/edit`}>
                                            <Button size="icon" variant="ghost"><Edit className="w-4 h-4" /></Button>
                                        </Link>
                                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(post.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
