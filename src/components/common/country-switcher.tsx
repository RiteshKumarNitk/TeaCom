"use client";

import { useCountry } from "@/context/country-context";
import { type Country } from "@/lib/i18n";
import { Check, Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function CountrySwitcher() {
    const { country, setCountry, locale, setLocale } = useCountry();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleCountry = (c: Country) => {
        setCountry(c);
        setIsOpen(false);
    };

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-sm font-medium"
            >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{country}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2">
                        <div className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">
                            Select Region
                        </div>

                        <button
                            onClick={() => toggleCountry("in")}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                                country === "in" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">🇮🇳</span>
                                <div className="flex flex-col items-start leading-none gap-1">
                                    <span className="font-medium">India</span>
                                    <span className="text-[10px] text-muted-foreground">INR (₹)</span>
                                </div>
                            </div>
                            {country === "in" && <Check className="w-4 h-4" />}
                        </button>

                        <button
                            onClick={() => toggleCountry("sa")}
                            className={cn(
                                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors mt-1",
                                country === "sa" ? "bg-primary/10 text-primary" : "hover:bg-muted"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">🇸🇦</span>
                                <div className="flex flex-col items-start leading-none gap-1">
                                    <span className="font-medium">Saudi Arabia</span>
                                    <span className="text-[10px] text-muted-foreground">SAR (﷼)</span>
                                </div>
                            </div>
                            {country === "sa" && <Check className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
