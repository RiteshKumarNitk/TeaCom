"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { search } from "./actions"; // Server action
import Link from "next/link";
import Image from "next/image";
import { useCountry } from "@/context/country-context";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { country, currency } = useCountry();

    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const data = await search(debouncedQuery);
                setResults(data);
            } catch (error) {
                console.error("Search error", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    // Handle clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className="relative w-full max-w-sm">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search teas..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="pl-9 pr-9 bg-muted/50 border-transparent focus:bg-white focus:border-primary transition-all rounded-full"
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery("");
                            setIsOpen(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (query.length >= 2) && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-50 max-h-[400px] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                    ) : results.length > 0 ? (
                        <div className="flex flex-col gap-1">
                            {results.map((product) => {
                                const price = product.basePrice[country] || product.basePrice["in"];
                                return (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors group"
                                    >
                                        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm text-gray-900 truncate">{product.name}</h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="font-bold text-primary">
                                                    {price.currency === "INR" ? "₹" : "﷼"} {price.amount}
                                                </span>
                                                <span>• {product.category}</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}

                            <div className="border-t border-gray-100 pt-2 mt-1">
                                <Link
                                    href={`/shop?q=${query}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block p-2 text-center text-xs font-medium text-primary hover:text-primary/80 hover:underline"
                                >
                                    View all {results.length} results
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No products found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
