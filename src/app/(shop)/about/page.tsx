import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="max-w-3xl mx-auto space-y-8 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Our Story</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Blue Tea is a brand rooted in wellness. The shift towards a healthy lifestyle starts with your morning cup.
                    By introducing organic flower-based herbal teas sourced directly from the farms, we aspire to bring a difference
                    to everyone's lifestyle. We believe that nature holds the cure, and our mission is to deliver it in its purest form.
                </p>

                <div className="aspect-video relative bg-blue-50 rounded-2xl overflow-hidden shadow-lg my-12">
                    <div className="absolute inset-0 flex items-center justify-center text-blue-200 text-6xl">
                        ☕
                    </div>
                    {/* Real image would go here */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <Feature title="Farm to Cup" text="Directly sourced from Indian farms, ensuring 0% bitterness and 100% natural flavor." />
                    <Feature title="100% Natural" text="No preservatives, no artificial colors - just pure dried flowers and herbs." />
                    <Feature title="Ancient Wisdom" text="Blending Ayurveda with modern taste to create teas that heal and delight." />
                </div>
            </div>
        </div>
    );
}

function Feature({ title, text }: { title: string, text: string }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-blue-50 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{text}</p>
        </div>
    )
}
