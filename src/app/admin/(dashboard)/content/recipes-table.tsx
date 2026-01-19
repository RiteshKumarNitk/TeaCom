"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Globe } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RecipesTable() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchRecipes();
    }, []);

    async function fetchRecipes() {
        const { data } = await supabase
            .from("recipes")
            .select("*")
            .order("created_at", { ascending: false });
        if (data) setRecipes(data);
        setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return;
        await supabase.from("recipes").delete().eq("id", id);
        fetchRecipes();
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Recipe Name</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recipes.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">No recipes found.</TableCell>
                        </TableRow>
                    ) : (
                        recipes.map((recipe) => (
                            <TableRow key={recipe.id}>
                                <TableCell className="font-medium">
                                    {recipe.title}
                                </TableCell>
                                <TableCell className="capitalize">{recipe.difficulty}</TableCell>
                                <TableCell>{recipe.prep_time}</TableCell>
                                <TableCell>
                                    <Badge variant={recipe.is_published ? "default" : "secondary"}>
                                        {recipe.is_published ? "Published" : "Draft"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/recipes`} target="_blank">
                                            <Button size="icon" variant="ghost" title="View"><Globe className="w-4 h-4" /></Button>
                                        </Link>
                                        <Link href={`/admin/content/recipes/${recipe.id}/edit`}>
                                            <Button size="icon" variant="ghost"><Edit className="w-4 h-4" /></Button>
                                        </Link>
                                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(recipe.id)}>
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
