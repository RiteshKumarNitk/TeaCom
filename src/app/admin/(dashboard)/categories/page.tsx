import { createClient } from "@/lib/supabase/server";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    const supabase = await createClient();

    const { data: categories, error } = await (supabase as any)
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="text-red-500">Failed to load categories: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Categories</h1>
                <Button>+ New Category</Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!categories || categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((cat: any) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-muted-foreground text-xs font-mono">{cat.slug}</TableCell>
                                    <TableCell className="max-w-xs truncate text-muted-foreground">{cat.description || "-"}</TableCell>
                                    <TableCell>
                                        {cat.is_active ?
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge> :
                                            <Badge variant="outline">Hidden</Badge>
                                        }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
