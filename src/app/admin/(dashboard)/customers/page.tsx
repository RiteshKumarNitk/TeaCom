import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";

export default async function CustomersPage() {
    // Restricted to Super Admin, Admin, and Support
    await requireAdmin("manage_users");

    const supabase = await createClient();

    // Fetch customers (profile table)
    const { data: customers } = await (supabase as any)
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold">Customers</h1>
                <p className="text-muted-foreground">View and manage your registered users.</p>
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Registered Users ({customers?.length || 0})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b text-gray-500 font-medium">
                                    <th className="py-4 px-4">Name</th>
                                    <th className="py-4 px-4">Email</th>
                                    <th className="py-4 px-4">Phone</th>
                                    <th className="py-4 px-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-gray-700">
                                {customers?.map((customer: any) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4 font-medium">{customer.full_name || "N/A"}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3 h-3 text-gray-400" />
                                                {customer.email}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {customer.phone ? (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-3 h-3 text-gray-400" />
                                                    {customer.phone}
                                                </div>
                                            ) : "-"}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                {customer.created_at ? format(new Date(customer.created_at), "MMM d, yyyy") : "N/A"}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(!customers || customers.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-gray-500">
                                            No customers joined yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
