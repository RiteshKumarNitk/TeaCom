"use client";

import Link from "next/link";
import { ShoppingBag, Menu, Search, User, Heart } from "lucide-react";
import { CountrySwitcher } from "@/components/common/country-switcher";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { UserMenu } from "./user-menu";

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const { cartCount, setIsOpen } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-border/50 shadow-sm">
            {/* Top Bar - Blue */}
            <div className="bg-primary text-primary-foreground py-2 text-[10px] sm:text-xs font-medium tracking-wide">
                <div className="container mx-auto px-4 flex justify-between items-center whitespace-nowrap overflow-hidden">
                    <div className="flex gap-4 md:gap-8 animate-marquee sm:animate-none">
                        <span>🎉 20 Lakh + Happy Customers</span>
                        <span>•</span>
                        <span>Featured on Shark Tank India 🦈</span>
                        <span>•</span>
                        <span>🎁 Free Gift on Orders Above ₹1299!</span>
                    </div>
                    <div className="hidden md:flex gap-4">
                        <Link href="/track" className="hover:text-yellow-300 transition-colors">Track Order</Link>
                        <Link href="/contact" className="hover:text-yellow-300 transition-colors">Contact Us</Link>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">

                    {/* Mobile Menu & Search (Left) */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button className="p-2 -ml-2 text-foreground/80 hover:text-primary">
                            <Menu className="w-6 h-6" />
                        </button>
                        <button className="p-2 text-foreground/80 hover:text-primary">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Desktop Search (Left) */}
                    <div className="hidden lg:flex flex-1 max-w-xs relative bg-muted/30 rounded-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search tea..."
                            className="bg-transparent border-none text-sm w-full pl-9 pr-4 py-2 focus:ring-0 placeholder:text-muted-foreground/50"
                        />
                    </div>

                    {/* Logo (Center) */}
                    <Link href="/" className="flex-shrink-0 flex items-center justify-center gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl pt-1 md:text-3xl font-bold font-sans tracking-tight text-primary">BLUE TEA</span>
                            {/* Small tagline if needed */}
                        </div>
                    </Link>

                    {/* Actions (Right) */}
                    <div className="flex flex-1 justify-end items-center gap-2 md:gap-4">
                        <CountrySwitcher />

                        <Link href="/wishlist" className="p-2 hover:bg-muted rounded-full transition-colors hidden sm:flex text-foreground/70 hover:text-primary">
                            <Heart className="w-5 h-5" />
                        </Link>

                        <UserMenu />

                        <button
                            onClick={() => setIsOpen(true)}
                            className="p-2 hover:bg-muted rounded-full transition-colors relative group text-foreground/70 hover:text-primary"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Navbar (Bottom) */}
            <div className="border-t border-border/30 hidden lg:block">
                <div className="container mx-auto px-4">
                    <nav className="flex justify-center items-center gap-8 py-3 text-xs md:text-sm font-semibold tracking-wide text-foreground/80">
                        <NavLink href="/shop?sort=bestseller">BESTSELLER</NavLink>
                        <NavLink href="/shop?cat=sampler">SAMPLER PACK</NavLink>
                        <NavLink href="/shop?cat=wellness">WELLNESS</NavLink>
                        <NavLink href="/shop?sort=new">NEW ARRIVALS</NavLink>
                        <NavLink href="/shop?cat=combo">COMBO</NavLink>
                        <NavLink href="/about">OUR STORY</NavLink>
                        <NavLink href="/blog">BLOG</NavLink>
                        <NavLink href="/contact">CONTACT</NavLink>
                    </nav>
                </div>
            </div>
        </header>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="hover:text-primary hover:underline underline-offset-4 decoration-2 transition-all">
            {children}
        </Link>
    )
}
