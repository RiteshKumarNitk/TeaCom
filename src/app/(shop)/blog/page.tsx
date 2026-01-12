import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
    const posts = [
        {
            id: 1,
            title: "5 Benefits of Blue Tea You Didn't Know",
            excerpt: "Discover the hidden health benefits of Butterfly Pea Flower tea, from stress relief to glowing skin.",
            category: "Wellness",
            date: "Jan 12, 2025"
        },
        {
            id: 2,
            title: "How to Brew the Perfect Cup of Herbal Tea",
            excerpt: "Step-by-step guide to brewing flower teas to preserve their nutrients and color.",
            category: "Guide",
            date: "Jan 10, 2025"
        },
        {
            id: 3,
            title: "The Legend of the Blue Flower",
            excerpt: "Tracing the ancient history of the Butterfly Pea flower across Southeast Asia.",
            category: "History",
            date: "Jan 05, 2025"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col items-center text-center mb-16">
                <h1 className="text-4xl font-serif font-bold text-primary mb-4">Wellness Journal</h1>
                <p className="text-muted-foreground max-w-2xl">
                    Explore articles on tea culture, health benefits, and the journey of our ingredients.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map((post) => (
                    <article key={post.id} className="bg-white border border-blue-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-blue-100 flex items-center justify-center text-primary/30">
                            Image Placeholder
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-xs text-secondary-foreground/70 mb-3">
                                <span className="font-semibold text-secondary-foreground">{post.category}</span>
                                <span>•</span>
                                <span>{post.date}</span>
                            </div>
                            <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary">{post.title}</h2>
                            <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                            <Button variant="link" className="p-0 text-primary font-bold">Read More →</Button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
