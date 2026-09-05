import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Clock, MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSearch from "@/components/search/HeroSearch";
import PropertyCard from "@/components/property/PropertyCard";
import AgentCard from "@/components/agent/AgentCard";
import { MOCK_PROPERTIES, MOCK_AGENTS, MOCK_LOCATIONS } from "@/constants/mockData";
import heroImg from "@/assets/hero-property.jpg";

const STATS = [
    { value: "1,240+", label: "Active Listings" },
    { value: "380+", label: "Verified Agents" },
    { value: "SAR 4.2B", label: "Properties Sold" },
    { value: "8", label: "Markets Covered" },
];

const FEATURES = [
    { icon: Shield, title: "Verified Properties", desc: "Every listing is manually reviewed and verified by our team before it goes live." },
    { icon: TrendingUp, title: "Market Intelligence", desc: "Real-time pricing data and market trends to help you make informed decisions." },
    { icon: Clock, title: "Updated Daily", desc: "Our database refreshes continuously so you always see the most current availability." },
];

export default function Index() {
    const featured = MOCK_PROPERTIES.filter((p) => p.featured).slice(0, 6);
    const topAgents = MOCK_AGENTS.slice(0, 3);

    return (
        <div className="min-h-screen bg-[#121212]">
            <Header />

            {/* Hero */}
            <section className="relative min-h-screen flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImg} alt="Premium Property" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-[#121212]/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/80 via-transparent to-transparent" />
                </div>

                <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 w-full pt-32">
                    <div className="max-w-3xl mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#2C2C2E] rounded-full bg-[#1E1E1E]/80 backdrop-blur-sm mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                            <span className="text-[#98989D] text-xs font-medium uppercase tracking-widest">Find Your Next Property</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
                            Find a place that<br />
                            <span className="text-[#00E5FF]">feels like home.</span>
                        </h1>
                        <p className="text-[#98989D] text-lg max-w-xl leading-relaxed">
                            Carefully selected properties in the locations that matter to you, verified by experts who understand the MENA market.
                        </p>
                    </div>

                    <HeroSearch />

                    {/* Stats */}
                    <div className="mt-12 flex flex-wrap gap-8">
                        {STATS.map((s) => (
                            <div key={s.label}>
                                <p className="text-white font-mono font-bold text-2xl">{s.value}</p>
                                <p className="text-[#98989D] text-xs mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-[#00E5FF] text-xs font-medium uppercase tracking-widest mb-3">Curated Selection</p>
                        <h2 className="text-white text-3xl lg:text-4xl font-bold tracking-tight">Featured Properties</h2>
                        <p className="text-[#98989D] text-sm mt-2">Handpicked properties worth your attention.</p>
                    </div>
                    <Link to="/properties" className="hidden sm:flex items-center gap-2 text-sm text-[#98989D] hover:text-white transition-colors group">
                        View all listings
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-[#00E5FF]">
                        View all listings <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            {/* Why Aqar */}
            <section className="border-y border-[#2C2C2E] bg-[#1E1E1E]/50">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#2C2C2E]">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-[#121212] p-10 lg:p-12">
                                <div className="w-10 h-10 border border-[#2C2C2E] rounded-xl flex items-center justify-center mb-6">
                                    <Icon size={18} className="text-[#00E5FF]" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-3">{title}</h3>
                                <p className="text-[#98989D] text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Locations */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-[#00E5FF] text-xs font-medium uppercase tracking-widest mb-3">Where We Operate</p>
                        <h2 className="text-white text-3xl lg:text-4xl font-bold tracking-tight">Prime Locations</h2>
                    </div>
                    <Link to="/locations" className="hidden sm:flex items-center gap-2 text-sm text-[#98989D] hover:text-white group">
                        All locations <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MOCK_LOCATIONS.slice(0, 4).map((loc) => (
                        <Link key={loc.id} to={`/locations/${loc.slug}`}
                            className="group relative rounded-2xl overflow-hidden aspect-[3/4] block">
                            <img src={loc.image} alt={loc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <MapPin size={11} className="text-[#00E5FF]" />
                                    <span className="text-[#98989D] text-xs">{loc.country}</span>
                                </div>
                                <h3 className="text-white font-semibold text-lg">{loc.name}</h3>
                                <p className="text-[#98989D] text-xs mt-1 font-mono">{loc.properties} properties</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Agents */}
            <section className="bg-[#1E1E1E]/30 border-y border-[#2C2C2E]">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <p className="text-[#00E5FF] text-xs font-medium uppercase tracking-widest mb-3">Our Team</p>
                            <h2 className="text-white text-3xl lg:text-4xl font-bold tracking-tight">Senior Consultants</h2>
                            <p className="text-[#98989D] text-sm mt-2">Expert guidance from professionals who know each market deeply.</p>
                        </div>
                        <Link to="/agents" className="hidden sm:flex items-center gap-2 text-sm text-[#98989D] hover:text-white group">
                            All agents <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topAgents.map((a) => <AgentCard key={a.id} agent={a} />)}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24">
                <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-3xl p-12 lg:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative max-w-2xl">
                        <p className="text-[#00E5FF] text-xs font-medium uppercase tracking-widest mb-4">For Property Owners</p>
                        <h2 className="text-white text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                            List your property with us.
                        </h2>
                        <p className="text-[#98989D] text-base leading-relaxed mb-8">
                            Reach thousands of qualified buyers and tenants. Our verified listing process ensures your property gets in front of serious, pre-screened prospects.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/list-property"
                                className="px-8 py-3.5 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl hover:bg-[#00E5FF]/90 transition-colors">
                                List a Property
                            </Link>
                            <Link to="/agents"
                                className="px-8 py-3.5 border border-[#2C2C2E] text-white text-sm rounded-xl hover:border-[#3C3C3E] transition-colors">
                                Contact an Agent
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
