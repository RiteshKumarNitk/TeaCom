"use client";

import { useActionState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import { signup } from "@/app/(shop)/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";

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
                    Create Account <Sparkles className="w-4 h-4 text-[#DAA520]" />
                </span>
            )}
        </Button>
    );
}

const initialState = {
    error: "",
};

export default function SignupPage() {
    const [state, formAction] = useActionState(signup, initialState);

    return (
        <div className="flex min-h-screen w-full">
            {/* Right Side - Form (Swapped for variety from login) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white order-2 lg:order-1 relative">
                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block lg:hidden mb-8 text-2xl font-serif font-bold text-[#0B1C3E]">
                            TeaCom
                        </Link>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0B1C3E] tracking-tight mb-2">
                            Join Our Community
                        </h2>
                        <p className="text-gray-500">
                            Start your premium tea journey today.
                        </p>
                    </div>

                    <form action={formAction} className="space-y-6 mt-8">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-900">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0B1C3E] focus:ring-[#0B1C3E]/20 transition-all rounded-xl"
                                    placeholder="John Doe"
                                />
                            </div>

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
                                <Label htmlFor="password" className="text-sm font-medium text-gray-900">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="h-12 px-4 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#0B1C3E] focus:ring-[#0B1C3E]/20 transition-all rounded-xl"
                                    placeholder="••••••••"
                                />
                                <p className="text-xs text-gray-500">Must be at least 8 characters long</p>
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

                    <p className="text-center text-sm text-gray-500 my-8">
                        By creating an account, you agree to our <Link href="/terms" className="text-[#0B1C3E] hover:underline">Terms</Link> and <Link href="/privacy" className="text-[#0B1C3E] hover:underline">Privacy Policy</Link>.
                    </p>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center w-full h-12 px-6 font-medium text-[#0B1C3E] bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>

            {/* Left Side - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0B1C3E] relative items-center justify-center overflow-hidden order-1 lg:order-2">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay transition-transform duration-1000 hover:scale-105"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?q=80&w=2574&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-bl from-[#0B1C3E]/90 via-[#0B1C3E]/70 to-transparent" />

                <div className="relative z-10 p-12 max-w-xl text-white text-right">
                    <h1 className="text-5xl font-serif font-bold mb-6 leading-tight">
                        Unlock Exclusive <span className="text-[#DAA520]">Benefits</span>
                    </h1>
                    <ul className="space-y-6 text-lg text-gray-200 inline-block text-left">
                        <li className="flex items-center gap-4">
                            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#DAA520] border border-white/20">🎁</span>
                            <span>Welcome gift on your first order</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#DAA520] border border-white/20">🚚</span>
                            <span>Free shipping on orders over ₹1299</span>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#DAA520] border border-white/20">✨</span>
                            <span>Early access to new blends</span>
                        </li>
                    </ul>
                </div>

                {/* Decorative circles */}
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#DAA520]/20 rounded-full blur-3xl opacity-50" />
            </div>
        </div>
    );
}
