"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { createPost, updatePost } from "./actions";
import Link from "next/link";
import { ChevronLeft, Loader2, Save, Trash } from "lucide-react";
import { useFormStatus } from "react-dom";
import { createClient } from "@/lib/supabase/client";

function SubmitButton({ isEditing }: { isEditing: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <><Save className="w-4 h-4 mr-2" /> {isEditing ? "Update Post" : "Create Post"}</>
            )}
        </Button>
    );
}

interface PostEditorProps {
    post?: any; // Type as needed
}

export default function PostEditor({ post }: PostEditorProps) {
    const isEditing = !!post;
    const initialState = { error: "" };
    const [state, formAction] = useActionState(isEditing ? updatePost : createPost, initialState);

    // Image Upload State
    const [imageUrl, setImageUrl] = useState(post?.cover_image || "");
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                return;
            }
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Client-side Supabase client for storage
            const supabase = createClient();

            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
            setImageUrl(data.publicUrl);
        } catch (error: any) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin/blog">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold font-serif">{isEditing ? "Edit Post" : "New Post"}</h1>
                    <p className="text-muted-foreground">{isEditing ? "Update your article." : "Write a new article."}</p>
                </div>
            </div>

            <form action={formAction} className="space-y-6 bg-card p-8 rounded-xl border border-border">
                {isEditing && <input type="hidden" name="id" value={post.id} />}

                {/* Hidden input to send image URL to server action */}
                <input type="hidden" name="cover_image" value={imageUrl} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={post?.title}
                            placeholder="The Benefits of Green Tea"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            name="slug"
                            defaultValue={post?.slug}
                            placeholder="benefits-green-tea"
                            className="font-mono text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <div className="flex items-start gap-4">
                        {imageUrl && (
                            <div className="relative w-32 h-24 rounded-md overflow-hidden border border-border">
                                <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImageUrl("")}
                                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                                >
                                    <Trash className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                        <div className="flex-1">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            {uploading && <p className="text-xs text-muted-foreground mt-1 animate-pulse">Uploading...</p>}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                    <Textarea
                        id="excerpt"
                        name="excerpt"
                        defaultValue={post?.excerpt}
                        placeholder="Short summary for SEO and cards..."
                        rows={2}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Content (Markdown/HTML)</Label>
                    <Textarea
                        id="content"
                        name="content"
                        defaultValue={post?.content}
                        placeholder="# Heading\n\nWrite your content here..."
                        className="min-h-[300px] font-mono"
                        required
                    />
                </div>

                <div className="flex items-center space-x-2 border p-4 rounded-lg">
                    <Switch id="is_published" name="is_published" defaultChecked={post?.is_published} />
                    <Label htmlFor="is_published">Publish immediately</Label>
                </div>

                {state?.error && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                        {state.error}
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <SubmitButton isEditing={isEditing} />
                </div>
            </form>
        </div>
    );
}
