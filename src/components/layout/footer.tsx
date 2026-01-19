import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/site-settings";

export async function Footer() {
    const settings = await getSiteSettings();
    const general = settings.general || {};
    const footerConfig = settings.footer || {};

    return (
        <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t border-primary/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                    {/* Column 1: Brand & Contact */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold font-display text-primary">Hi Storm Tea</h2>
                        <div className="space-y-4 text-sm opacity-80">
                            <p className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                                <span>{general.address || "Redplan Private Ltd., Kolkata, India"}</span>
                            </p>
                            <p className="flex items-center gap-3">
                                <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                                <a href={`mailto:${general.support_email}`} className="hover:text-primary transition-colors">
                                    {general.support_email || "contact@histormtea.com"}
                                </a>
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone className="w-4 h-4 flex-shrink-0 text-primary" />
                                <span>{general.phone || "+91 98765 43210"}</span>
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <SocialIcon Icon={Facebook} href={general.facebook_url} />
                            <SocialIcon Icon={Instagram} href={general.instagram_url} />
                            <SocialIcon Icon={Twitter} href={general.twitter_url} />
                            <SocialIcon Icon={Youtube} href={general.youtube_url} />
                        </div>
                    </div>

                    {/* Column 2: Explore */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-primary">Explore</h3>
                        <ul className="space-y-3 text-sm opacity-80">
                            <li><Link href="/shop?cat=new" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Shop</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Policies */}
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-primary">Policies</h3>
                        <ul className="space-y-3 text-sm opacity-80">
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Condition</Link></li>
                            <li><Link href="/refund" className="hover:text-primary transition-colors">Cancellation & Refund Policy</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: About Content */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-primary">About Us</h3>
                        <p className="text-sm opacity-80 leading-relaxed">
                            {footerConfig.about_text || "Experience the finest organic teas, sourced directly from the misty gardens of India. We are dedicated to bringing you the purest flavors and aromas."}
                        </p>
                        <Link href="/about" className="inline-block mt-4 border border-primary/30 text-primary px-6 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors uppercase tracking-widest">
                            Read More
                        </Link>
                    </div>
                </div>

                <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-60">
                    <p>{footerConfig.copyright_text || `© ${new Date().getFullYear()} Hi Storm Tea. All rights reserved.`}</p>
                    <Link href="/admin/login" className="hover:text-primary transition-colors mt-2 md:mt-0">
                        Admin Login
                    </Link>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ Icon, href }: { Icon: any, href?: string }) {
    if (!href) return null;
    return (
        <a href={href} className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
            <Icon className="w-4 h-4" />
        </a>
    )
}
