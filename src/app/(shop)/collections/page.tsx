import Link from "next/link";

export default function CollectionsPage() {
    const collections = [
        { name: "Best Sellers", slug: "bestseller", color: "bg-yellow-100" },
        { name: "New Arrivals", slug: "new", color: "bg-blue-100" },
        { name: "Wellness Teas", slug: "wellness", color: "bg-green-100" },
        { name: "Gift Sets", slug: "combo", color: "bg-purple-100" },
        { name: "Sampler Packs", slug: "sampler", color: "bg-pink-100" },
        { name: "Flower Teas", slug: "flower", color: "bg-indigo-100" },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-serif font-bold text-primary mb-8 border-b pb-4">Shop by Collection</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {collections.map((col) => (
                    <Link
                        key={col.slug}
                        href={`/shop?cat=${col.slug}`}
                        className={`group relative h-48 rounded-2xl overflow-hidden ${col.color} flex items-center justify-center hover:shadow-lg transition-all`}
                    >
                        <span className="text-2xl font-bold text-gray-900 z-10">{col.name}</span>
                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
