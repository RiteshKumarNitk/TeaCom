import Link from "next/link";
import { productService } from "@/services/product/product.service";
import { ProductCard } from "@/components/product/product-card";
import { ArrowRight, Leaf, ShieldCheck, Truck, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const bestsellers = await productService.getBestsellers();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] lg:h-[700px] w-full flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-tea.png"
            alt="Premium Tea Background"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-white">
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <span className="inline-block py-1.5 px-4 rounded-full bg-gold-400/20 border border-gold-400/30 text-gold-200 text-xs font-bold tracking-wider uppercase mb-6 backdrop-blur-md">
              Premium Collection 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-br from-gold-100 to-gold-400 drop-shadow-sm">
              Sip the Essence of <br />
              <span className="text-white">Pure Luxury</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed font-light">
              Curated selection of the finest organic teas from India's misty gardens,
              delivered fresh to your doorstep in India and Saudi Arabia.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/shop"
                className="px-8 py-3.5 rounded-full bg-gold-400 text-black font-semibold hover:bg-gold-500 transition-all shadow-lg hover:shadow-gold-500/20 flex items-center gap-2 group"
              >
                Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium hover:bg-white/20 transition-all"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="group p-6 rounded-2xl hover:bg-muted/30 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <Leaf className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif text-primary">100% Organic Sourcing</h3>
              <p className="text-muted-foreground leading-relaxed">Directly from certified expansive gardens in Assam and Darjeeling.</p>
            </div>
            <div className="group p-6 rounded-2xl hover:bg-muted/30 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-gold-400/10 flex items-center justify-center text-gold-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif text-primary">Global Delivery</h3>
              <p className="text-muted-foreground leading-relaxed">Seamless shipping to India & Saudi Arabia with all customs handled.</p>
            </div>
            <div className="group p-6 rounded-2xl hover:bg-muted/30 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif text-primary">Premium Quality</h3>
              <p className="text-muted-foreground leading-relaxed">Hand-picked leaves ensuring only the finest buds make it to your cup.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-3 text-primary">Our Bestsellers</h2>
              <p className="text-muted-foreground text-lg">Most loved blends across the Middle East and India.</p>
            </div>
            <Link href="/shop" className="text-primary font-medium hover:text-primary/80 flex items-center gap-2 group">
              View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {bestsellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
              <p className="text-muted-foreground">No bestsellers marked yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-12 text-center text-primary">Explore by Category</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Wellness */}
            <Link href="/shop?category=Wellness" className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <img src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80" alt="Wellness Tea" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-6 left-6 z-20 text-white">
                <h3 className="text-2xl font-bold mb-1 group-hover:text-gold-400 transition-colors">Wellness</h3>
                <p className="text-sm text-gray-300">Detox & Immunity</p>
              </div>
            </Link>

            {/* Black Tea */}
            <Link href="/shop?category=Black" className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <img src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80" alt="Black Tea" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-6 left-6 z-20 text-white">
                <h3 className="text-2xl font-bold mb-1 group-hover:text-gold-400 transition-colors">Black Tea</h3>
                <p className="text-sm text-gray-300">Robust & Classic</p>
              </div>
            </Link>

            {/* Green Tea */}
            <Link href="/shop?category=Green" className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              <img src="https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80" alt="Green Tea" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-6 left-6 z-20 text-white">
                <h3 className="text-2xl font-bold mb-1 group-hover:text-gold-400 transition-colors">Green Tea</h3>
                <p className="text-sm text-gray-300">Fresh & Light</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
