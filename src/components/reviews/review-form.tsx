"use client";

import { useActionState, useState } from "react";
import { addReview } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Submitting..." : "Submit Review"}
        </Button>
    )
}

export function ReviewForm({ productId, onCancel }: { productId: string, onCancel: () => void }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    // @ts-ignore
    const [state, formAction] = useActionState(addReview, null);

    if (state?.success) {
        return (
            <div className="bg-green-50 text-green-700 p-6 rounded-xl border border-green-200 text-center">
                <h3 className="font-bold text-lg mb-2">Thank You!</h3>
                <p>Your review has been submitted successfully.</p>
                <Button variant="outline" onClick={onCancel} className="mt-4 bg-white">Close</Button>
            </div>
        )
    }

    return (
        <form action={formAction} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-4">
            <input type="hidden" name="productId" value={productId} />
            <input type="hidden" name="rating" value={rating} />

            <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                className={cn(
                                    "w-8 h-8 transition-colors",
                                    (hoverRating || rating) >= star
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-transparent text-gray-300"
                                )}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Summarize your experience" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">Review</Label>
                <Textarea
                    id="content"
                    name="content"
                    placeholder="What did you like or dislike? How was the taste?"
                    required
                    className="min-h-[100px]"
                />
            </div>

            {state?.error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                    {state.error}
                </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                <SubmitButton />
            </div>
        </form>
    );
}
