import { productService } from "@/services/product/product.service";
import { ProductCard } from "@/components/product/product-card";

interface ShopPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const sort = typeof params.sort === 'string' && ["price_asc", "price_desc", "newest"].includes(params.sort)
        ? params.sort as "price_asc" | "price_desc" | "newest"
        : undefined;

    const products = await productService.getProducts({ category, sort });

    return (
        <div className="container mx-auto px-4 py-32">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">
                        {category ? `${category} Tea` : "Shop All Tea"}
                    </h1>
                    <p className="text-muted-foreground">Discover our complete collection of premium organic teas.</p>
                </div>

                {/* Sort/Filter Controls */}
                <div className="flex flex-wrap gap-4 items-center">
                    <span className="text-sm font-medium text-muted-foreground">
                        {products.length} Products
                    </span>

                    {/* Basic Category Links */}
                    <div className="flex gap-2 text-sm">
                        <a href="/shop" className={`px-3 py-1 rounded-full border ${!category ? 'bg-primary text-white border-primary' : 'hover:bg-muted'}`}>All</a>
                        <a href="/shop?category=Black" className={`px-3 py-1 rounded-full border ${category === 'Black' ? 'bg-primary text-white border-primary' : 'hover:bg-muted'}`}>Black</a>
                        <a href="/shop?category=Green" className={`px-3 py-1 rounded-full border ${category === 'Green' ? 'bg-primary text-white border-primary' : 'hover:bg-muted'}`}>Green</a>
                        <a href="/shop?category=Wellness" className={`px-3 py-1 rounded-full border ${category === 'Wellness' ? 'bg-primary text-white border-primary' : 'hover:bg-muted'}`}>Wellness</a>
                    </div>
                </div>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                    <p className="text-lg text-muted-foreground">No products found in this category.</p>
                    <a href="/shop" className="text-primary hover:underline mt-2 inline-block">View all products</a>
                </div>
            )}
        </div>
    );
}
