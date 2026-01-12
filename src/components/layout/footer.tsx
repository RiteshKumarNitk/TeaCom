import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                    {/* Column 1: Brand & Contact */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold font-sans">BLUE TEA</h2>
                        <div className="space-y-4 text-sm text-blue-100">
                            <p className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                <span>Redplan Private Ltd.<br />Shiv Shakti Complex, Dado Road,<br />Madhyamgram, Kolkata - 700155</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <Mail className="w-4 h-4 flex-shrink-0" />
                                <a href="mailto:contact@bluetea.co.in" className="hover:text-white">contact@bluetea.co.in</a>
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <span>+91 7980528437 / +91 7980116079</span>
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <SocialIcon Icon={Facebook} />
                            <SocialIcon Icon={Instagram} />
                            <SocialIcon Icon={Twitter} />
                            <SocialIcon Icon={Youtube} />
                        </div>
                    </div>

                    {/* Column 2: Explore */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Explore</h3>
                        <ul className="space-y-3 text-sm text-blue-100">
                            <li><Link href="/shop?cat=new" className="hover:text-white">New Arrivals</Link></li>
                            <li><Link href="/shop" className="hover:text-white">Shop</Link></li>
                            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                            <li><Link href="/about" className="hover:text-white">Our Story</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Policies */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-6">Policies</h3>
                        <ul className="space-y-3 text-sm text-blue-100">
                            <li><Link href="/terms" className="hover:text-white">Terms & Condition</Link></li>
                            <li><Link href="/refund" className="hover:text-white">Cancellation & Refund Policy</Link></li>
                            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                            <li><Link href="/shipping" className="hover:text-white">Shipping Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: About Content */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">About Blue Tea</h3>
                        <p className="text-sm text-blue-100 leading-relaxed">
                            Blue Tea is a brand rooted in wellness. The shift towards a healthy lifestyle starts with your morning cup. By introducing organic flower-based herbal teas sourced directly from the farms, we aspire to bring a difference to everyone's lifestyle.
                        </p>
                        <Link href="/about" className="inline-block mt-4 border border-white/30 px-6 py-2 text-sm font-medium hover:bg-white hover:text-primary transition-colors uppercase tracking-widest">
                            Read More
                        </Link>
                    </div>
                </div>

                <div className="border-t border-blue-800 pt-8 text-center text-xs text-blue-300">
                    <p>&copy; {new Date().getFullYear()} Redplan Private Ltd. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ Icon }: { Icon: any }) {
    return (
        <a href="#" className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center hover:bg-white hover:text-primary transition-colors">
            <Icon className="w-4 h-4" />
        </a>
    )
}
