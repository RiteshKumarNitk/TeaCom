import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

// Mock Recipes
const RECIPES = [
    {
        id: "1",
        title: "Classic Masala Chai",
        image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800",
        description: "The authentic Indian way to brew chai with strong CTC tea and spices.",
        time: "10 mins",
        difficulty: "Easy",
        servings: 2,
        slug: "classic-masala-chai"
    },
    {
        id: "2",
        title: "Iced Lemon Mint Tea",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800",
        description: "A refreshing cooler for hot summer days made with Green Tea.",
        time: "15 mins",
        difficulty: "Easy",
        servings: 4,
        slug: "iced-lemon-mint-tea"
    },
    {
        id: "3",
        title: "Golden Milk Tea Latte",
        image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=800",
        description: "Turmetic infused herbal tea latte for immunity.",
        time: "12 mins",
        difficulty: "Medium",
        servings: 2,
        slug: "golden-milk-tea"
    }
];

export const metadata = {
    title: "Tea Recipes | TeaCom",
    description: "Discover delicious tea recipes from around the world.",
};

export default function RecipesPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="bg-orange-50 py-16 px-4">
                <div className="container mx-auto text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-orange-900">Tea Recipes</h1>
                    <p className="text-xl text-orange-800/80 max-w-2xl mx-auto">
                        Turn your daily cup into a culinary masterpiece.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {RECIPES.map((recipe) => (
                        <div key={recipe.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-4">
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-2 left-2 flex gap-2">
                                    <Badge className="bg-black/50 text-white border-none backdrop-blur-sm">{recipe.difficulty}</Badge>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold font-serif mb-2 group-hover:text-primary transition-colors">
                                {recipe.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {recipe.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {recipe.time}</span>
                                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {recipe.servings} Servings</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
