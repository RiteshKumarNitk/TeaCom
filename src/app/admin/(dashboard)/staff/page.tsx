import { getStaff } from "./actions";
import { StaffForm } from "./staff-form";
import { StaffActions } from "./staff-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Users, Mail, Shield, Clock } from "lucide-react";

export default async function StaffPage() {
    const staff = await getStaff();

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "super_admin": return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none">Super Admin</Badge>;
            case "admin": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Admin</Badge>;
            case "operations": return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">Operations</Badge>;
            case "content_manager": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Content</Badge>;
            default: return <Badge variant="secondary">Support</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Staff Management</h1>
                    <p className="text-gray-500">Manage administrative accounts and their system permissions.</p>
                </div>
                <StaffForm />
            </div>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Team Members ({staff.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b text-gray-500 font-medium">
                                    <th className="py-4 px-4">Admin Name</th>
                                    <th className="py-4 px-4">Role</th>
                                    <th className="py-4 px-4">Last Login</th>
                                    <th className="py-4 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {staff.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-900">{member.full_name}</span>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {member.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {getRoleBadge(member.role)}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                {member.last_login
                                                    ? format(new Date(member.last_login), "MMM d, h:mm a")
                                                    : "Never"
                                                }
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <StaffActions staffId={member.id} currentRole={member.role} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-primary/5 border-none">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Security Note</p>
                                <p className="text-xs text-gray-500">Only Super Admins can delete other staff members or assign the Super Admin role.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
