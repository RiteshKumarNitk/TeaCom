import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
    return (
        <div className="container mx-auto px-4 py-12 text-center min-h-[50vh] flex flex-col items-center justify-center">
            <h1 className="text-3xl font-serif font-bold text-primary mb-4">Your Wishlist</h1>
            <p className="text-muted-foreground mb-8">
                Save your favorite teas here to buy later. <br />
                (This feature is coming soon!)
            </p>
            <Button asChild className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-full">
                <Link href="/shop">Continue Shopping</Link>
            </Button>
        </div>
    );
}
