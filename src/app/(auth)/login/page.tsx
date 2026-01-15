"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/app/(shop)/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full bg-[#0B1C3E] hover:bg-[#1a2f55] text-white h-11 text-base transition-all duration-200"
            disabled={pending}
        >
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
        </Button>
    );
}

const initialState = {
    error: "",
};

export default function LoginPage() {
    const [state, formAction] = useActionState(login, initialState);

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Brand/Image */}
            <div className="hidden lg:flex w-1/2 bg-[#0B1C3E] relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B1C3E] via-[#0B1C3E]/90 to-[#0B1C3E]/70" />

                <div className="relative z-10 text-center px-12 max-w-lg">
                    <div className="mb-8 flex justify-center">
                        <div className="h-24 w-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                            <span className="text-[#FFD700] font-serif text-5xl font-bold">T</span>
                        </div>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-white mb-6 tracking-wide">
                        TeaCom Premium
                    </h1>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        Experience the finest selection of premium teas from around the world.
                        Manage your store and orders with elegance.
                    </p>
                </div>

                {/* Decorative Circles */}
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FFD700]/10 rounded-full blur-3xl" />
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50/50 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-10 bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden mx-auto h-12 w-12 rounded-full bg-[#0B1C3E] flex items-center justify-center text-[#FFD700] font-serif text-xl font-bold mb-4">
                            T
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-[#0B1C3E] tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Please enter your details to sign in
                        </p>
                    </div>

                    <form action={formAction} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="h-11 border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0B1C3E] focus:ring-[#0B1C3E] transition-all duration-200"
                                    placeholder="admin@teacom.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-medium text-[#0B1C3E] hover:text-[#DAA520] transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="h-11 border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0B1C3E] focus:ring-[#0B1C3E] transition-all duration-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                                {state.error}
                            </div>
                        )}

                        <SubmitButton />
                    </form>

                    <div className="text-center text-sm pt-2">
                        <span className="text-gray-500">Don't have an account? </span>
                        <Link href="/signup" className="font-semibold text-[#0B1C3E] hover:text-[#DAA520] transition-colors">
                            Sign up now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
