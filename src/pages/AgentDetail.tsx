import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Phone, Mail, BadgeCheck, Building2, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { MOCK_AGENTS, MOCK_PROPERTIES } from "@/constants/mockData";

export default function AgentDetail() {
    const { id } = useParams();
    const agent = MOCK_AGENTS.find((a) => a.id === id);
    const properties = MOCK_PROPERTIES.filter((p) => p.agent === id);

    if (!agent) return (
        <div className="min-h-screen bg-[#121212]">
            <Header />
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-white text-lg">Agent not found.</p>
                    <Link to="/agents" className="text-[#00E5FF] text-sm mt-4 block">← Back to Agents</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#121212] text-right" dir="rtl">
            <Header />
            <div className="pt-16">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
                    <Link to="/agents" className="inline-flex items-center gap-2 text-sm text-[#98989D] hover:text-white mb-8 transition-colors">
                        <ArrowLeft size={14} className="rotate-180" /> جميع المستشارين
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Profile */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-8 sticky top-24">
                                <div className="text-center mb-6">
                                    <div className="relative inline-block mb-4">
                                        <img src={agent.avatar} alt={agent.name} className="w-20 h-20 rounded-2xl object-cover mx-auto" />
                                        {agent.verified && (
                                            <div className="absolute -bottom-1 -end-1 w-6 h-6 bg-[#00E5FF] rounded-full flex items-center justify-center">
                                                <BadgeCheck size={13} className="text-[#121212]" />
                                            </div>
                                        )}
                                    </div>
                                    <h1 className="text-white font-bold text-xl mb-1">{agent.name}</h1>
                                    <p className="text-[#98989D] text-sm">{agent.title}</p>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <Star size={13} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-white text-sm font-medium">{agent.rating}</span>
                                        <span className="text-[#98989D] text-xs">({agent.reviews} تقييم)</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {[
                                        { icon: Building2, label: agent.company },
                                        { icon: MapPin, label: agent.location },
                                        { icon: Phone, label: agent.phone, href: `tel:${agent.phone}`, ltr: true },
                                        { icon: Mail, label: agent.email, href: `mailto:${agent.email}` },
                                    ].map(({ icon: Icon, label, href, ltr }) => (
                                        <div key={label} className="flex items-center gap-3 text-sm text-[#98989D]">
                                            <Icon size={13} className="text-[#00E5FF] shrink-0" />
                                            {href ? <a href={href} className="hover:text-white transition-colors" dir={ltr ? "ltr" : "auto"}>{label}</a> : <span>{label}</span>}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-[#121212] border border-[#2C2C2E] rounded-xl p-3 text-center">
                                        <p className="text-white font-mono font-bold text-xl">{agent.listings}</p>
                                        <p className="text-[#98989D] text-xs">عقارات</p>
                                    </div>
                                    <div className="bg-[#121212] border border-[#2C2C2E] rounded-xl p-3 text-center">
                                        <p className="text-white font-mono font-bold text-xl">{agent.reviews}</p>
                                        <p className="text-[#98989D] text-xs">مراجعات</p>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <p className="text-xs text-[#98989D] mb-2">اللغات</p>
                                    <div className="flex flex-wrap gap-2">
                                        {agent.languages.map((l) => (
                                            <span key={l} className="px-2.5 py-1 text-xs text-[#98989D] border border-[#2C2C2E] rounded-lg">{l}</span>
                                        ))}
                                    </div>
                                </div>

                                <a href={`tel:${agent.phone}`}
                                    className="block w-full py-3 bg-[#00E5FF] text-[#121212] font-semibold text-sm text-center rounded-xl hover:bg-[#00E5FF]/90 transition-colors">
                                    تواصل مع المستشار
                                </a>
                            </div>
                        </div>

                        {/* Bio + Listings */}
                        <div className="lg:col-span-2">
                            <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-6 mb-8">
                                <h2 className="text-white font-semibold text-lg mb-4">نبذة شخصية</h2>
                                <p className="text-[#98989D] text-sm leading-relaxed">{agent.bio}</p>
                            </div>

                            <h2 className="text-white font-semibold text-lg mb-5">العقارات النشطة ({properties.length})</h2>
                            {properties.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
                                </div>
                            ) : (
                                <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-12 text-center">
                                    <p className="text-[#98989D] text-sm">لا توجد عقارات نشطة حالياً.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
