import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
    const supabase = await createClient();

    // 1. Fetch Logs
    // Note: We cast to 'any' for now due to persistent TS inference issues with new tables.
    const { data: logs, error } = await (supabase as any)
        .from("audit_logs")
        .select(`
            id,
            action,
            entity_type,
            entity_id,
            created_at,
            ip_address,
            old_value,
            new_value,
            actor_id
        `)
        .order("created_at", { ascending: false })
        .limit(50);

    // 2. Fetch Actor Names (Optional: Could be a separate join if we had strict foreign key relation working perfectly in types)
    // For now, raw display or simple lookup if needed. We'll show ID or email if we joined.
    // Let's assume we want to show email. We can try to join 'users' but 'auth.users' isn't directly joinable via standard client usually without config.
    // So we will just show the Actor ID or "System" for now.

    if (error) {
        return <div className="text-red-500">Failed to load logs: {error.message}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Security Audit Logs</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="w-[180px]">Timestamp</TableHead>
                            <TableHead>Actor (User ID)</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Diff (New vs Old)</TableHead>
                            <TableHead className="text-right">IP Address</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!logs || logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                    No audit logs found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log: any) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {format(new Date(log.created_at), "MMM d, yyyy HH:mm:ss")}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs" title={log.actor_id}>
                                        {log.actor_id?.substring(0, 8)}...
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono bg-blue-50 text-blue-700 border-blue-200">
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="capitalize text-sm">
                                        {log.entity_type} <span className="text-muted-foreground text-xs ml-1">#{log.entity_id.substring(0, 6)}</span>
                                    </TableCell>
                                    <TableCell className="max-w-md">
                                        {log.new_value || log.old_value ? (
                                            <details className="text-xs text-muted-foreground cursor-pointer">
                                                <summary>View Changes</summary>
                                                <div className="mt-2 p-2 bg-slate-900 text-slate-50 rounded-md font-mono overflow-auto max-h-32">
                                                    <pre>{JSON.stringify(log.new_value || log.old_value, null, 2)}</pre>
                                                </div>
                                            </details>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                                        {log.ip_address}
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
