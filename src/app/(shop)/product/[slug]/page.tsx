import { productService } from "@/services/product/product.service";
import { ProductDetails } from "@/components/product/product-details";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await productService.getProductBySlug(slug);

    if (!product) {
        return { title: "Product Not Found" };
    }

    return {
        title: `${product.name} | TeaCom Premium`,
        description: product.description,
    };
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await productService.getProductBySlug(slug);

    if (!product) {
        return notFound();
    }

    return <ProductDetails product={product} />;
}
