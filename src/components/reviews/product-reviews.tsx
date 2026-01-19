"use client";

import { useState, useEffect } from "react";
import { ReviewForm } from "./review-form";
import { ReviewList } from "./review-list";
import { Button } from "@/components/ui/button";
import { getReviews } from "./actions";
import { Star, MessageSquarePlus } from "lucide-react";

export function ProductReviews({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isWriting, setIsWriting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReviews = async () => {
        const data = await getReviews(productId);
        setReviews(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div id="reviews" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border pb-8">
                <div>
                    <h2 className="text-2xl font-serif font-bold mb-1">Customer Reviews</h2>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-400">
                            <span className="text-xl font-bold text-gray-900 mr-1">{averageRating}</span>
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current" />
                            <Star className="w-5 h-5 fill-current text-gray-200" />
                            {/* Ideally dynamic stars based on average, simplicity for now */}
                        </div>
                        <span className="text-sm text-muted-foreground">Based on {reviews.length} reviews</span>
                    </div>
                </div>
                {!isWriting && (
                    <Button onClick={() => setIsWriting(true)}>
                        <MessageSquarePlus className="w-4 h-4 mr-2" />
                        Write a Review
                    </Button>
                )}
            </div>

            {isWriting ? (
                <div className="mb-8">
                    <ReviewForm
                        productId={productId}
                        onCancel={() => {
                            setIsWriting(false);
                            fetchReviews(); // Refresh after submit/cancel
                        }}
                    />
                </div>
            ) : null}

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
                </div>
            ) : (
                <ReviewList reviews={reviews} />
            )}
        </div>
    );
}
