import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Twitter, Linkedin, Instagram } from "lucide-react";

const FOOTER_LINKS = {
    "العقارات": [
        { label: "فلل للبيع", href: "/properties?type=villa" },
        { label: "شقق", href: "/properties?type=apartment" },
        { label: "بنتهاوس", href: "/properties?type=penthouse" },
        { label: "للإيجار", href: "/properties?status=for-rent" },
        { label: "أحدث العقارات", href: "/properties" },
    ],
    "الشركة": [
        { label: "عن عقار", href: "/about" },
        { label: "وكلاؤنا", href: "/agents" },
        { label: "المناطق", href: "/locations" },
        { label: "اتصل بنا", href: "/contact" },
        { label: "أضف عقارك", href: "/list-property" },
    ],
    "قانوني": [
        { label: "سياسة الخصوصية", href: "#" },
        { label: "شروط الخدمة", href: "#" },
        { label: "سياسة ملفات تعريف الارتباط", href: "#" },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-[#121212] border-t border-[#2C2C2E] mt-24">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-7 h-7 bg-[#00E5FF] rounded-sm flex items-center justify-center">
                                <span className="text-[#121212] font-bold text-xs font-mono">ع</span>
                            </div>
                            <span className="text-white font-semibold text-lg">عقار</span>
                        </div>
                        <p className="text-[#98989D] text-sm leading-relaxed max-w-sm">
                            منصة منتقاة للعقارات السكنية الفاخرة في جميع أنحاء المملكة العربية السعودية والشرق الأوسط.
                        </p>
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-[#98989D]">
                                <MapPin size={14} className="text-[#00E5FF] shrink-0" />
                                <span>طريق الملك فهد، الرياض 12211، المملكة العربية السعودية</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#98989D]">
                                <Phone size={14} className="text-[#00E5FF] shrink-0" />
                                <span dir="ltr">+966 11 000 0000</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-[#98989D]">
                                <Mail size={14} className="text-[#00E5FF] shrink-0" />
                                <span>info@aqar.com</span>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                            {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 border border-[#2C2C2E] rounded-md flex items-center justify-center text-[#98989D] hover:text-white hover:border-[#00E5FF]/40 transition-colors">
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-white text-sm font-semibold mb-4">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.href} className="text-[#98989D] text-sm hover:text-white transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-6 border-t border-[#2C2C2E] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[#98989D] text-xs">© 2026 عقار. جميع الحقوق محفوظة.</p>
                    <p className="text-[#98989D] text-xs">
                        مرخص من الهيئة العامة للعقار · ترخيص رقم{" "}
                        <span className="font-mono text-[#98989D]" dir="ltr">REGA-2024-1054</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
