"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Product, Money } from "@/types/product";
import { useCountry } from "@/context/country-context";

export interface CartItem {
    id: string; // Composite ID: productId_variantId
    product: Product;
    quantity: number;
    variantId?: string;
    price: Money; // Snapshot price at time of add
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, quantity: number, variantId?: string) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const { country } = useCountry();

    // Load from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem("teacom-cart");
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("teacom-cart", JSON.stringify(items));
        }
    }, [items, isInitialized]);

    const addItem = useCallback((product: Product, quantity: number, variantId?: string) => {
        // Get current country price
        const currentPrice = product.basePrice[country] || product.basePrice["in"];

        // Construct unique ID
        const cartItemId = variantId ? `${product.id}_${variantId}` : product.id;

        setItems((prev) => {
            const existing = prev.find((item) => item.id === cartItemId);
            if (existing) {
                return prev.map((item) =>
                    item.id === cartItemId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [
                ...prev,
                {
                    id: cartItemId,
                    product,
                    quantity,
                    variantId,
                    price: currentPrice, // Store the price relevant to CURRENT country
                },
            ];
        });
        setIsOpen(true); // Open cart on add
    }, [country]);

    const removeItem = useCallback((itemId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== itemId));
    }, []);

    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity < 1) return removeItem(itemId);
        setItems((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
        );
    }, [removeItem]);

    const clearCart = useCallback(() => setItems([]), []);

    // Calculate totals based on CURRENT country if possible, or fallback to saved currency
    // Note: mixing currencies in a cart is tricky. 
    // Strategy: If user switches country, we should ideally re-fetch/re-calculate prices.
    // For MVP, we presume the price stored in the item is valid, or we re-derive it.
    const cartTotal = items.reduce((total, item) => {
        // Re-calculate price based on CURRENT country context to handle switches
        const currentPrice = item.product.basePrice[country] || item.product.basePrice["in"];
        return total + (currentPrice.amount * item.quantity);
    }, 0);

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                isOpen,
                setIsOpen,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
