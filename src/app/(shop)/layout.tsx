import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

import { createClient } from "@/lib/supabase/server";

export default async function ShopLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data: coupons } = await supabase
        .from("coupons")
        .select("*")
        .eq("is_active", true);

    return (
        <>
            <Header coupons={coupons as any} />
            <CartDrawer />
            <div className="pt-[116px] lg:pt-[130px] min-h-screen flex flex-col">
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </>
    );
}
