import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Twitter, Linkedin, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();

    const FOOTER_LINKS = {
        [t("footer.properties")]: [
            { label: t("footer.villasForSale"), href: "/properties?type=villa" },
            { label: t("footer.apartments"), href: "/properties?type=apartment" },
            { label: t("footer.penthouses"), href: "/properties?type=penthouse" },
            { label: t("footer.forRent"), href: "/properties?status=for-rent" },
            { label: t("footer.latestProperties"), href: "/properties" },
        ],
        [t("footer.company")]: [
            { label: t("footer.aboutAqar"), href: "/about" },
            { label: t("footer.ourAgents"), href: "/agents" },
            { label: t("footer.locations"), href: "/locations" },
            { label: t("footer.contactUs"), href: "/contact" },
            { label: t("footer.addProperty"), href: "/list-property" },
        ],
        [t("footer.legal")]: [
            { label: t("footer.privacyPolicy"), href: "#" },
            { label: t("footer.termsOfService"), href: "#" },
            { label: t("footer.cookiePolicy"), href: "#" },
        ],
    };

    return (
        <footer className="bg-aqar-base border-t border-aqar-border mt-24">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-7 h-7 bg-aqar-cyan rounded-sm flex items-center justify-center">
                                <span className="text-aqar-base font-bold text-xs font-mono">ع</span>
                            </div>
                            <span className="text-aqar-text font-semibold text-lg">عقار</span>
                        </div>
                        <p className="text-aqar-muted text-sm leading-relaxed max-w-sm">
                            {t("footer.description")}
                        </p>
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-3 text-sm text-aqar-muted">
                                <MapPin size={14} className="text-aqar-cyan shrink-0" />
                                <span>{t("footer.address")}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-aqar-muted">
                                <Phone size={14} className="text-aqar-cyan shrink-0" />
                                <span dir="ltr">+966 11 000 0000</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-aqar-muted">
                                <Mail size={14} className="text-aqar-cyan shrink-0" />
                                <span>info@aqar.com</span>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                            {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-9 h-9 border border-aqar-border rounded-md flex items-center justify-center text-aqar-muted hover:text-aqar-text hover:border-aqar-cyan/40 transition-colors">
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-aqar-text text-sm font-semibold mb-4">{category}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link to={link.href} className="text-aqar-muted text-sm hover:text-aqar-text transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-6 border-t border-aqar-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-aqar-muted text-xs">{t("footer.rights")}</p>
                    <p className="text-aqar-muted text-xs">
                        {t("footer.licensed")}{" "}
                        <span className="font-mono text-aqar-muted" dir="ltr">REGA-2024-1054</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
