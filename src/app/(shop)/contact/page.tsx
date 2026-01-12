import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-serif font-bold text-primary text-center mb-12">Get in Touch</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                        <div className="space-y-6">
                            <ContactItem icon={MapPin} title="Visit Us" text="Redplan Private Ltd., Shiv Shakti Complex, Kolkata - 700155" />
                            <ContactItem icon={Mail} title="Email Us" text="contact@bluetea.co.in" />
                            <ContactItem icon={Phone} title="Call Us" text="+91 7980528437" />
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-50">
                    <h2 className="text-xl font-bold mb-6">Send us a message</h2>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="First Name" />
                            <Input placeholder="Last Name" />
                        </div>
                        <Input type="email" placeholder="Email Address" />
                        <Input placeholder="Subject" />
                        <Textarea placeholder="How can we help you?" className="min-h-[120px]" />
                        <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Send Message</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function ContactItem({ icon: Icon, title, text }: any) {
    return (
        <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-primary">
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-gray-600 text-sm mt-1">{text}</p>
            </div>
        </div>
    )
}
