"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Assuming you have an icon or use an image
import { MessageCircle } from "lucide-react";

export function WhatsAppWidget({ phoneNumber }: { phoneNumber?: string }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !phoneNumber) return null;

    // Clean number for URL
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");

    return (
        <a
            href={`https://wa.me/${cleanNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
            title="Chat with us on WhatsApp"
        >
            <MessageCircle className="w-8 h-8 fill-current" />
            <span className="sr-only">WhatsApp</span>
        </a>
    );
}
