"use client";

import { useActionState } from "react";
import { adminLogin } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
    const [state, formAction, isPending] = useActionState(adminLogin, {});

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <ShieldCheck className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-serif font-bold">Admin Portal</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the management dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        {state?.error && (
                            <Alert variant="destructive">
                                <AlertDescription>{state.error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@teacom.com"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                disabled={isPending}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full font-bold h-11"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                "Secure Login"
                            )}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-gray-500">Don't have an account? </span>
                        <Link href="/admin/signup" className="text-primary font-medium hover:underline">
                            Register here
                        </Link>
                    </div>

                    <div className="mt-6 text-center text-xs text-gray-500">
                        <p>© 2026 TeaCom Administrative System</p>
                        <p>Authorized access only. All activities are logged.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
