import { supabaseAdmin } from "@/lib/supabase/admin";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {

    const { data: collections, error } = await (supabaseAdmin as any)
        .from("collections")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return <div className="text-red-500">Failed to load collections: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-gray-900">Collections</h1>
                <Link href="/admin/collections/new">
                    <Button>+ New Collection</Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Schedule</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!collections || collections.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No collections found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            collections.map((col: any) => (
                                <TableRow key={col.id}>
                                    <TableCell className="font-medium">{col.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">{col.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs font-mono">{col.slug}</TableCell>
                                    <TableCell>
                                        {col.is_active ?
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge> :
                                            <Badge variant="outline">Draft</Badge>
                                        }
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {col.starts_at ? format(new Date(col.starts_at), "MMM d") : "Now"}
                                        {" - "}
                                        {col.ends_at ? format(new Date(col.ends_at), "MMM d") : "Forever"}
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
