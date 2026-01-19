import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function SignupSuccessPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
            <div className="w-full max-w-md text-center bg-card p-12 rounded-2xl shadow-xl border border-border/50">
                <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                    <MailCheck className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
                    Check your email
                </h2>
                <p className="text-muted-foreground mb-8 text-lg">
                    We've sent a verification link to your email address. Please click the link to activate your account.
                </p>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/login">Return to Login</Link>
                </Button>
            </div>
        </div>
    );
}
