import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, TrendingUp, Shield, Clock, MapPin, Building } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSearch from "@/components/search/HeroSearch";
import PropertyCard from "@/components/property/PropertyCard";
import AgentCard from "@/components/agent/AgentCard";
import { MOCK_LOCATIONS } from "@/constants/mockData";
import { useProperties, useAgents } from "@/hooks/useRealData";
import heroImg from "@/assets/hero-property.jpg";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const { data: properties = [], isLoading: isLoadingProperties } = useProperties();
    const { data: agents = [], isLoading: isLoadingAgents } = useAgents();

    const featured = properties.filter((p) => p.featured).slice(0, 6);
    const topAgents = agents.slice(0, 3);
    const isRTL = i18n.language === 'ar';
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

    const STATS = [
        { value: "1,240+", label: t("home.stats.properties") },
        { value: "380+", label: t("home.stats.agents") },
        { value: "4.2B", label: t("home.stats.sales") },
        { value: "8", label: t("home.stats.markets") },
    ];

    const FEATURES = [
        { icon: Shield, title: t("home.features.verifiedTitle"), desc: t("home.features.verifiedDesc") },
        { icon: TrendingUp, title: t("home.features.marketTitle"), desc: t("home.features.marketDesc") },
        { icon: Clock, title: t("home.features.dailyTitle"), desc: t("home.features.dailyDesc") },
    ];

    return (
        <div className="min-h-screen bg-aqar-base">
            <Header />

            {/* Hero */}
            <section className="relative min-h-screen flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImg} alt="Premium Property" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-aqar-base via-aqar-base/60 to-aqar-base/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-aqar-base/80 via-transparent to-transparent" />
                </div>

                <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 w-full pt-32">
                    <div className="max-w-3xl mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-aqar-border rounded-full bg-aqar-surface/80 backdrop-blur-sm mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-aqar-cyan animate-pulse" />
                            <span className="text-aqar-muted text-xs font-medium uppercase tracking-widest">{t("home.searchTitle")}</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-aqar-text leading-tight mb-6">
                            {t("home.heroTitle1")}<br />
                            <span className="text-aqar-cyan">{t("home.heroTitle2")}</span>
                        </h1>
                        <p className="text-aqar-muted text-lg max-w-xl leading-relaxed">
                            {t("home.heroSubtitle")}
                        </p>
                    </div>

                    <HeroSearch />

                    {/* Stats */}
                    <div className="mt-12 flex flex-wrap gap-8">
                        {STATS.map((s) => (
                            <div key={s.label}>
                                <p className="text-aqar-text font-mono font-bold text-2xl">{s.value}</p>
                                <p className="text-aqar-muted text-xs mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-aqar-cyan text-xs font-medium uppercase tracking-widest mb-3">{t("home.featured")}</p>
                        <h2 className="text-aqar-text text-3xl lg:text-4xl font-bold tracking-tight">{t("home.featuredTitle")}</h2>
                        <p className="text-aqar-muted text-sm mt-2">{t("home.featuredDesc")}</p>
                    </div>
                    <Link to="/properties" className="hidden sm:flex items-center gap-2 text-sm text-aqar-muted hover:text-aqar-text transition-colors group">
                        {t("home.viewAll")}
                        <ArrowIcon size={14} className={cn("transition-transform", isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoadingProperties ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="aspect-[4/3] rounded-2xl bg-aqar-border animate-pulse" />
                        ))
                    ) : featured.length > 0 ? (
                        featured.map((p) => <PropertyCard key={p.id} property={p} />)
                    ) : (
                        <div className="col-span-full py-12 text-center text-aqar-muted border border-dashed border-aqar-border rounded-2xl">
                            {t("home.noFeatured")}
                        </div>
                    )}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link to="/properties" className="inline-flex items-center justify-center gap-2 text-sm text-aqar-cyan">
                        {t("home.viewAll")} <ArrowIcon size={14} />
                    </Link>
                </div>
            </section>

            {/* Why AMSH */}
            <section className="border-y border-aqar-border bg-aqar-surface/50">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-aqar-border">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-aqar-base p-10 lg:p-12">
                                <div className="w-10 h-10 border border-aqar-border rounded-xl flex items-center justify-center mb-6">
                                    <Icon size={18} className="text-aqar-cyan" />
                                </div>
                                <h3 className="text-aqar-text font-semibold text-lg mb-3">{title}</h3>
                                <p className="text-aqar-muted text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Locations */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                {(() => {
                    const activeLocations = MOCK_LOCATIONS.map(loc => ({
                        ...loc,
                        properties: properties?.filter(p => p.location?.city?.toLowerCase() === loc.name.toLowerCase()).length || 0
                    })).filter(loc => loc.properties > 0);
                    
                    if (activeLocations.length === 0) return null;

                    return (
                        <>
                            <div className="flex items-end justify-between mb-12">
                                <div>
                                    <p className="text-aqar-cyan text-xs font-medium uppercase tracking-widest mb-3">{t("home.whereWeWork")}</p>
                                    <h2 className="text-aqar-text text-3xl lg:text-4xl font-bold tracking-tight">{t("home.topLocations")}</h2>
                                </div>
                                <Link to="/locations" className="hidden sm:flex items-center gap-2 text-sm text-aqar-muted hover:text-aqar-text group">
                                    {t("home.allLocations")} <ArrowIcon size={14} className={cn("transition-transform", isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
                                </Link>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {activeLocations.slice(0, 4).map((loc) => (
                                    <Link key={loc.id} to={`/locations/${loc.slug}`}
                                        className="group relative rounded-2xl overflow-hidden aspect-[3/4] block">
                                        <img src={loc.image} alt={loc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-5">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <MapPin size={11} className="text-aqar-cyan" />
                                                <span className="text-gray-300 text-xs">{loc.country}</span>
                                            </div>
                                            <h3 className="text-white font-semibold text-lg">{loc.name}</h3>
                                            <p className="text-gray-400 text-xs mt-1 font-mono">{loc.properties} {t("home.propertiesCount")}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    );
                })()}
            </section>

            {/* Agents */}
            <section className="bg-aqar-surface/30 border-y border-aqar-border">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <p className="text-aqar-cyan text-xs font-medium uppercase tracking-widest mb-3">{t("home.ourTeam")}</p>
                            <h2 className="text-aqar-text text-3xl lg:text-4xl font-bold tracking-tight">{t("home.topAgents")}</h2>
                            <p className="text-aqar-muted text-sm mt-2">{t("home.agentsDesc")}</p>
                        </div>
                        <Link to="/agents" className="hidden sm:flex items-center gap-2 text-sm text-aqar-muted hover:text-aqar-text group">
                            {t("home.allAgents")} <ArrowIcon size={14} className={cn("transition-transform", isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1")} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {isLoadingAgents ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-64 rounded-2xl bg-aqar-border animate-pulse" />
                            ))
                        ) : topAgents.length > 0 ? (
                            topAgents.map((a) => <AgentCard key={a.id} agent={a} />)
                        ) : (
                            <div className="col-span-full py-12 text-center text-aqar-muted border border-dashed border-aqar-border rounded-2xl">
                                {t("home.noAgents")}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
                <div className="bg-aqar-surface border border-aqar-border rounded-3xl p-12 lg:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="absolute top-0 end-0 w-96 h-96 bg-aqar-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 start-0 w-96 h-96 bg-aqar-cyan/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative max-w-2xl z-10">
                        <p className="text-aqar-cyan text-xs font-bold uppercase tracking-widest mb-4">{t("home.forOwners")}</p>
                        <h2 className="text-aqar-text text-3xl lg:text-5xl font-bold tracking-tight mb-6">
                            {t("home.listWithUs")}
                        </h2>
                        <p className="text-aqar-muted text-lg leading-relaxed mb-8 max-w-xl">
                            {t("home.listDesc")}
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {user && (user.role === "admin" || user.role === "supervisor") ? (
                                <>
                                    <Link to="/list-property"
                                        className="px-8 py-3.5 bg-aqar-cyan text-aqar-btnText font-semibold text-sm rounded-xl hover:bg-aqar-cyan/90 transition-colors shadow-[0_0_20px] shadow-aqar-cyan/20">
                                        {t("home.addPropertyBtn")}
                                    </Link>
                                    <Link to="/agents"
                                        className="px-8 py-3.5 border border-aqar-border bg-aqar-base/50 text-aqar-text text-sm rounded-xl hover:border-aqar-cyan/50 hover:bg-aqar-cyan/5 transition-all">
                                        {t("home.contactAgentBtn")}
                                    </Link>
                                </>
                            ) : (
                                <Link to="/agents"
                                    className="px-8 py-3.5 bg-aqar-cyan text-aqar-btnText font-semibold text-sm rounded-xl hover:bg-aqar-cyan/90 transition-colors shadow-[0_0_20px] shadow-aqar-cyan/20">
                                    {t("home.contactAgentBtn")}
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="relative hidden lg:flex items-center justify-center w-72 h-72 z-10">
                        <div className="absolute inset-0 bg-gradient-to-tr from-aqar-cyan/20 to-transparent rounded-full blur-2xl animate-pulse" />
                        <Building size={120} className="text-aqar-cyan drop-shadow-[0_0_15px] drop-shadow-aqar-cyan/40" />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
