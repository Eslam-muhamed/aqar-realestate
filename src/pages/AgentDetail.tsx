import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Phone, Mail, BadgeCheck, Building2, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { useAgent, useProperties } from "@/hooks/useRealData";

export default function AgentDetail() {
    const { id } = useParams();
    const { data: agent, isLoading: loadingAgent } = useAgent(id || "");
    const { data: allProperties = [] } = useProperties();
    
    const properties = allProperties.filter((p) => p.agent === id);

    if (loadingAgent) {
        return (
            <div className="min-h-screen bg-aqar-base flex flex-col items-center justify-center">
                <Header />
                <div className="mt-24 w-8 h-8 border-4 border-aqar-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!agent) return (
        <div className="min-h-screen bg-aqar-base">
            <Header />
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-aqar-text text-lg">لم يتم العثور على الوكيل.</p>
                    <Link to="/agents" className="text-aqar-cyan text-sm mt-4 block">← العودة للوكلاء</Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-aqar-base text-start">
            <Header />
            <div className="pt-16">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
                    <Link to="/agents" className="inline-flex items-center gap-2 text-sm text-aqar-muted hover:text-aqar-text mb-8 transition-colors">
                        <ArrowLeft size={14} className="rotate-180" /> جميع المستشارين
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Profile */}
                        <div className="lg:col-span-1">
                            <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-8 sticky top-24">
                                <div className="text-center mb-6">
                                    <div className="relative inline-block mb-4">
                                        <img src={agent.avatar} alt={agent.name} className="w-20 h-20 rounded-2xl object-cover mx-auto" />
                                        {agent.verified && (
                                            <div className="absolute -bottom-1 -end-1 w-6 h-6 bg-aqar-cyan rounded-full flex items-center justify-center">
                                                <BadgeCheck size={13} className="text-[#121212]" />
                                            </div>
                                        )}
                                    </div>
                                    <h1 className="text-aqar-text font-bold text-xl mb-1">{agent.name}</h1>
                                    <p className="text-aqar-muted text-sm">{agent.title}</p>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <Star size={13} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-aqar-text text-sm font-medium">{agent.rating}</span>
                                        <span className="text-aqar-muted text-xs">({agent.reviews} تقييم)</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {[
                                        { icon: Building2, label: agent.company },
                                        { icon: MapPin, label: agent.location },
                                        { icon: Phone, label: agent.phone, href: `tel:${agent.phone}`, ltr: true },
                                        { icon: Mail, label: agent.email, href: `mailto:${agent.email}` },
                                    ].map(({ icon: Icon, label, href, ltr }) => (
                                        <div key={label} className="flex items-center gap-3 text-sm text-aqar-muted">
                                            <Icon size={13} className="text-aqar-cyan shrink-0" />
                                            {href ? <a href={href} className="hover:text-aqar-text transition-colors" dir={ltr ? "ltr" : "auto"}>{label}</a> : <span>{label}</span>}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-aqar-base border border-aqar-border rounded-xl p-3 text-center">
                                        <p className="text-aqar-text font-mono font-bold text-xl">{agent.listings}</p>
                                        <p className="text-aqar-muted text-xs">عقارات</p>
                                    </div>
                                    <div className="bg-aqar-base border border-aqar-border rounded-xl p-3 text-center">
                                        <p className="text-aqar-text font-mono font-bold text-xl">{agent.reviews}</p>
                                        <p className="text-aqar-muted text-xs">مراجعات</p>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <p className="text-xs text-aqar-muted mb-2">اللغات</p>
                                    <div className="flex flex-wrap gap-2">
                                        {agent.languages.map((l) => (
                                            <span key={l} className="px-2.5 py-1 text-xs text-aqar-muted border border-aqar-border rounded-lg">{l}</span>
                                        ))}
                                    </div>
                                </div>

                                <a href={`tel:${agent.phone}`}
                                    className="block w-full py-3 bg-aqar-cyan text-[#121212] font-semibold text-sm text-center rounded-xl hover:bg-aqar-cyan/90 transition-colors">
                                    تواصل مع المستشار
                                </a>
                            </div>
                        </div>

                        {/* Bio + Listings */}
                        <div className="lg:col-span-2">
                            <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-6 mb-8">
                                <h2 className="text-aqar-text font-semibold text-lg mb-4">نبذة شخصية</h2>
                                <p className="text-aqar-muted text-sm leading-relaxed">{agent.bio}</p>
                            </div>

                            <h2 className="text-aqar-text font-semibold text-lg mb-5">العقارات النشطة ({properties.length})</h2>
                            {properties.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
                                </div>
                            ) : (
                                <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-12 text-center">
                                    <p className="text-aqar-muted text-sm">لا توجد عقارات نشطة حالياً.</p>
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
