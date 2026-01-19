import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsTable } from "./posts-table"; // We'll create this component
import { RecipesTable } from "./recipes-table"; // We'll create this component

export default async function ContentPage() {
    const supabase = await createClient();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Content Management</h1>
                    <p className="text-muted-foreground">Manage your blog posts and recipes.</p>
                </div>
            </div>

            <Tabs defaultValue="posts" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="posts">Blog Posts</TabsTrigger>
                    <TabsTrigger value="recipes">Recipes</TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-4">
                    <div className="flex justify-end">
                        <Link href="/admin/content/posts/new">
                            <Button className="gap-2"><Plus className="w-4 h-4" /> New Post</Button>
                        </Link>
                    </div>
                    <PostsTable />
                </TabsContent>

                <TabsContent value="recipes" className="space-y-4">
                    <div className="flex justify-end">
                        <Link href="/admin/content/recipes/new">
                            <Button className="gap-2"><Plus className="w-4 h-4" /> New Recipe</Button>
                        </Link>
                    </div>
                    <RecipesTable />
                </TabsContent>
            </Tabs>
        </div>
    );
}
