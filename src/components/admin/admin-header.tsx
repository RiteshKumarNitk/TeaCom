"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminHeader() {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4 w-1/3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-9 h-9 bg-gray-50 border-gray-200 focus:bg-white transition-all w-full md:w-64"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-[#0B1C3E] relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                </Button>

                <div className="h-8 w-8 rounded-full bg-[#0B1C3E] text-[#FFD700] flex items-center justify-center font-bold text-sm border-2 border-[#FFD700] shadow-sm">
                    A
                </div>
            </div>
        </header>
    );
}
