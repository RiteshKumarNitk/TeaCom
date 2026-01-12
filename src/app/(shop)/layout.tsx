import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

export default function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Header />
            <CartDrawer />
            <div className="pt-[116px] lg:pt-[130px] min-h-screen flex flex-col">
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </>
    );
}
