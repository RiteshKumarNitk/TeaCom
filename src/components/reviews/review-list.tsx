import { formatDistanceToNow } from "date-fns";
import { Star, CheckCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReviewList({ reviews }: { reviews: any[] }) {
    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No reviews yet. Be the first to review this product!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm">{review.user?.full_name || "Anonymous"}</span>
                                    {review.is_verified_purchase && (
                                        <span className="text-[10px] text-green-600 flex items-center gap-0.5 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">
                                            <CheckCircle className="w-3 h-3" /> Verified
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="flex text-yellow-400">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={cn("w-3 h-3", review.rating >= star ? "fill-current" : "text-gray-200")}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        • {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h4 className="font-bold text-sm mb-1">{review.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
                </div>
            ))}
        </div>
    );
}
