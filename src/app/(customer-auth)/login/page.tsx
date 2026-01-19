"use client";

import { useActionState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/app/(shop)/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full bg-[#0B1C3E] hover:bg-[#1a2f55] text-white h-12 text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            disabled={pending}
        >
            {pending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                <span className="flex items-center justify-center gap-2">
                    Sign In <ArrowRight className="w-4 h-4" />
                </span>
            )}
        </Button>
    );
}

const initialState = {
    error: "",
};

function LoginContent() {
    const [state, formAction] = useActionState(login, initialState);
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("next") || "/";

    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0B1C3E] relative items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-1000 hover:scale-105"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576092768241-12390774ad75?q=80&w=2670&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B1C3E]/90 via-[#0B1C3E]/80 to-transparent" />

                <div className="relative z-10 p-12 max-w-xl text-white">
                    <div className="mb-8 inline-block p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                        <span className="text-3xl font-serif">☕</span>
                    </div>
                    <h1 className="text-5xl font-serif font-bold mb-6 leading-tight">
                        Experience the Art of <span className="text-[#DAA520]">Premium Tea</span>
                    </h1>
                    <p className="text-lg text-gray-200 leading-relaxed opacity-90">
                        Join our community of tea enthusiasts. Discover rare blends, curate your collection, and elevate your daily ritual.
                    </p>
                    <div className="mt-8 flex gap-4 text-sm font-medium text-[#DAA520]">
                        <span className="flex items-center gap-1">• Ethically Sourced</span>
                        <span className="flex items-center gap-1">• Premium Quality</span>
                        <span className="flex items-center gap-1">• Global Delivery</span>
                    </div>
                </div>

                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#DAA520]/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0B1C3E] to-transparent" />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white relative">
                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block lg:hidden mb-8 text-2xl font-serif font-bold text-[#0B1C3E]">
                            TeaCom
                        </Link>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1C3E] tracking-tight mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-500">
                            Please enter your details to access your account.
                        </p>
                    </div>

                    <form action={formAction} className="space-y-6 mt-8">
                        <input type="hidden" name="redirectTo" value={redirectTo} />

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0B1C3E] focus:ring-[#0B1C3E]/20 transition-all rounded-xl"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-900">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm font-medium text-[#0B1C3E] hover:text-[#DAA520] transition-colors"
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
                                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0B1C3E] focus:ring-[#0B1C3E]/20 transition-all rounded-xl"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="flex items-center gap-3 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                                {state.error}
                            </div>
                        )}

                        <div className="pt-2">
                            <SubmitButton />
                        </div>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">New to TeaCom?</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center w-full h-12 px-6 font-medium text-[#0B1C3E] bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all"
                        >
                            Create an Account
                        </Link>
                    </div>
                </div>

                {/* Mobile Background Elements */}
                <div className="lg:hidden absolute top-0 left-0 w-32 h-32 bg-[#DAA520]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="lg:hidden absolute bottom-0 right-0 w-32 h-32 bg-[#0B1C3E]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
