import { productService } from "@/services/product/product.service";
import { ProductCard } from "@/components/product/product-card";

export default async function ShopPage() {
    const products = await productService.getProducts();

    return (
        <div className="container mx-auto px-4 py-32">
            <div className="flex flex-col md:flex-row justify-between items-baseline mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">Shop All Tea</h1>
                    <p className="text-muted-foreground">Discover our complete collection of premium organic teas.</p>
                </div>
                {/* Sort/Filter Placeholder */}
                <div className="flex gap-4">
                    <span className="text-sm font-medium">Showing {products.length} results</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
