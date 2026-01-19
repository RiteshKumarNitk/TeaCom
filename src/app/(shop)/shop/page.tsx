import { productService } from "@/services/product/product.service";
import { ProductCard } from "@/components/product/product-card";

interface ShopPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;
    const category = typeof params.category === 'string' ? params.category : undefined;
    const sort = typeof params.sort === 'string' && ["price_asc", "price_desc", "newest", "bestseller"].includes(params.sort)
        ? params.sort as "price_asc" | "price_desc" | "newest" | "bestseller"
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
