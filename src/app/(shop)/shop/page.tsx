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
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b pb-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 text-primary">
                        {category ? `${category} Tea` : "Our Collection"}
                    </h1>
                    <p className="text-muted-foreground max-w-lg text-lg">
                        Discover our hand-picked selection of premium organic teas, sourced directly from the finest estates.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2">
                        <FilterPill href="/shop" active={!category} label="All" />
                        <FilterPill href="/shop?category=Black" active={category === 'Black'} label="Black Tea" />
                        <FilterPill href="/shop?category=Green" active={category === 'Green'} label="Green Tea" />
                        <FilterPill href="/shop?category=Wellness" active={category === 'Wellness'} label="Wellness" />
                        <FilterPill href="/shop?sort=bestseller" active={sort === 'price_desc'} label="Best Sellers" />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-8 lg:gap-y-12">
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

function FilterPill({ href, active, label }: { href: string, active: boolean, label: string }) {
    return (
        <a
            href={href}
            className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                ${active
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105'
                    : 'bg-white text-muted-foreground border-transparent hover:border-border hover:bg-muted'
                }
            `}
        >
            {label}
        </a>
    )
}
