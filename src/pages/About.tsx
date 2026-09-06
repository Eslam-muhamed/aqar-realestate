import { Link } from "react-router-dom";
import { CheckCircle, Users, Globe, Award } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import { useTranslation } from "react-i18next";

export default function About() {
    const { t } = useTranslation();

    const MILESTONES = [
        { year: "2018", title: t("aboutPage.foundedRiyadh"), desc: t("aboutPage.foundedDesc") },
        { year: "2020", title: t("aboutPage.expandedUAE"), desc: t("aboutPage.expandedDesc") },
        { year: "2022", title: t("aboutPage.active1000"), desc: t("aboutPage.active1000Desc") },
        { year: "2024", title: t("aboutPage.regionalLeader"), desc: t("aboutPage.regionalLeaderDesc") },
    ];

    const VALUES = [
        { icon: CheckCircle, title: t("aboutPage.verificationFirst"), desc: t("aboutPage.verificationDesc") },
        { icon: Users, title: t("aboutPage.clientCenter"), desc: t("aboutPage.clientCenterDesc") },
        { icon: Globe, title: t("aboutPage.regionalExpertise"), desc: t("aboutPage.regionalExpertiseDesc") },
        { icon: Award, title: t("aboutPage.professionalStandards"), desc: t("aboutPage.professionalStandardsDesc") },
    ];

    return (
        <div className="min-h-screen bg-aqar-base text-start">
            <Header />
            <div className="pt-16">
                {/* Hero */}
                <div className="border-b border-aqar-border">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                        <p className="text-aqar-cyan text-xs font-medium uppercase tracking-widest mb-4">{t("aboutPage.title")}</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-aqar-text text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                                    {t("aboutPage.heroTitle")}
                                </h1>
                                <p className="text-aqar-muted text-base leading-relaxed mb-8">
                                    {t("aboutPage.heroDesc")}
                                </p>
                                <div className="flex gap-4">
                                    <Link to="/properties" className="px-6 py-3 bg-aqar-cyan text-aqar-btnText font-semibold text-sm rounded-xl hover:bg-aqar-cyan/90 transition-colors">
                                        {t("aboutPage.browseProperties")}
                                    </Link>
                                    <Link to="/agents" className="px-6 py-3 border border-aqar-border text-aqar-text text-sm rounded-xl hover:border-aqar-muted transition-colors">
                                        {t("aboutPage.meetAdvisors")}
                                    </Link>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: "1,240+", label: t("aboutPage.activeProperties") },
                                    { value: "380+", label: t("aboutPage.verifiedAdvisors") },
                                    { value: "8", label: t("aboutPage.markets") },
                                    { value: t("aboutPage.realEstateSales") === "Real Estate Sales" ? "$1.1B" : "4.2B ر.س", label: t("aboutPage.realEstateSales"), ltr: true },
                                ].map(({ value, label, ltr }) => (
                                    <div key={label} className="bg-aqar-surface border border-aqar-border rounded-2xl p-6">
                                        <p className="text-aqar-text font-mono font-bold text-3xl mb-1 text-start" dir={ltr ? "ltr" : "auto"}>{value}</p>
                                        <p className="text-aqar-muted text-sm text-start">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                    <h2 className="text-aqar-text text-2xl font-bold mb-10 text-start">{t("aboutPage.valuesTitle")}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-aqar-surface border border-aqar-border rounded-2xl p-6">
                                <div className="w-10 h-10 border border-aqar-border rounded-xl flex items-center justify-center mb-5">
                                    <Icon size={18} className="text-aqar-cyan" />
                                </div>
                                <h3 className="text-aqar-text font-semibold text-sm mb-2 text-start">{title}</h3>
                                <p className="text-aqar-muted text-xs leading-relaxed text-start">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="border-t border-aqar-border">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                        <h2 className="text-aqar-text text-2xl font-bold mb-10 text-start">{t("aboutPage.journeyTitle")}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {MILESTONES.map(({ year, title, desc }) => (
                                <div key={year} className="relative ps-6 border-s-2 border-aqar-border">
                                    <div className="absolute start-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-aqar-cyan" />
                                    <p className="text-aqar-cyan font-mono text-sm font-semibold mb-2 text-start" dir="ltr">{year}</p>
                                    <h3 className="text-aqar-text font-semibold text-sm mb-2 text-start">{title}</h3>
                                    <p className="text-aqar-muted text-xs leading-relaxed text-start">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
