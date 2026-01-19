import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ArrowRight, Calendar } from "lucide-react";

export const metadata = {
    title: "Tea Journal | TeaCom Blog",
    description: "Explore the world of tea with our expert guides, recipes, and stories.",
};

export default async function BlogIndexPage() {
    const posts = await getBlogPosts();

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Section */}
            <div className="bg-primary text-primary-foreground py-20 px-4">
                <div className="container mx-auto text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold">The Tea Journal</h1>
                    <p className="text-xl md:text-2xl text-primary-foreground/80 max-w-2xl mx-auto font-light">
                        Stories, recipes, and wisdom from the world of premium tea.
                    </p>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                            <Card className="h-full border-none shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {post.tags.map(tag => (
                                            <Badge key={tag} className="bg-white/90 text-gray-900 border-none hover:bg-white">{tag}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                        <Calendar className="w-3 h-3" />
                                        {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                                        <span>•</span>
                                        <span>{post.readingTime}</span>
                                    </div>
                                    <h2 className="text-xl font-bold font-serif leading-tight group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0 text-primary font-semibold text-sm flex items-center gap-2">
                                    Read Article <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </CardFooter>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
