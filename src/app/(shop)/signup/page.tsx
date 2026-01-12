"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signup } from "@/app/(shop)/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full bg-[#0B1C3E] hover:bg-[#1a2f55] text-white" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
        </Button>
    );
}

const initialState = {
    error: "",
};

export default function SignupPage() {
    const [state, formAction] = useActionState(signup, initialState);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0B1C3E] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="w-full max-w-md space-y-8 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20 relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 rounded-full bg-[#0B1C3E] flex items-center justify-center text-[#FFD700] font-bold font-serif text-2xl mb-4 shadow-lg border-2 border-[#FFD700]">
                        T
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-[#0B1C3E]">
                        Join TeaCom
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create an account to start your premium journey
                    </p>
                </div>

                <form action={formAction} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-[#0B1C3E]">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="mt-1 border-gray-300 focus:border-[#0B1C3E] focus:ring-[#0B1C3E]"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-[#0B1C3E]">Email address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 border-gray-300 focus:border-[#0B1C3E] focus:ring-[#0B1C3E]"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-[#0B1C3E]">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 border-gray-300 focus:border-[#0B1C3E] focus:ring-[#0B1C3E]"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="text-sm text-red-600 font-medium text-center bg-red-50 p-2 rounded-md border border-red-200">
                            {state.error}
                        </div>
                    )}

                    <SubmitButton />
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-500">Already have an account? </span>
                    <Link href="/login" className="font-medium text-[#0B1C3E] hover:underline hover:text-[#DAA520]">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}
