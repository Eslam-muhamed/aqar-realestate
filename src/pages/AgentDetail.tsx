import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Phone, Mail, BadgeCheck, Building2, ArrowLeft, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { useAgent, useProperties } from "@/hooks/useRealData";
import { useTranslation } from "react-i18next";

export default function AgentDetail() {
    const { t } = useTranslation();
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
        <div className="min-h-screen flex flex-col bg-aqar-base">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 text-center min-h-[60vh]">
                <div className="w-16 h-16 bg-aqar-surface border border-aqar-border rounded-2xl flex items-center justify-center mb-6">
                    <Users size={24} className="text-aqar-muted" />
                </div>
                <p className="text-aqar-text text-lg">{t("agentsPage.agentNotFound")}</p>
                <Link to="/agents" className="text-aqar-cyan text-sm mt-4 block flex items-center justify-center gap-1">
                    <ArrowLeft size={14} className="rtl:hidden" /> {t("agentsPage.backToAgents")} <ArrowLeft size={14} className="hidden rtl:block rotate-180" />
                </Link>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen bg-aqar-base text-start">
            <Header />
            <div className="pt-16">
                <div className="border-b border-aqar-border bg-aqar-surface/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6 flex items-center gap-2">
                        <Link to="/agents" className="flex items-center gap-2 text-aqar-muted text-sm hover:text-aqar-text transition-colors">
                            <ArrowLeft size={14} className="rtl:hidden" /> {t("agentsPage.allAdvisors")} <ArrowLeft size={14} className="hidden rtl:block rotate-180" />
                        </Link>
                        <span className="text-aqar-muted/50">/</span>
                        <span className="text-aqar-text text-sm font-medium">{agent.name}</span>
                    </div>
                </div>
                
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Profile */}
                        <div className="lg:col-span-1">
                            <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-8 sticky top-24">
                                <div className="text-center mb-6">
                                    <div className="relative inline-block mb-4">
                                        <img src={agent.avatar} alt={agent.name} className="w-20 h-20 rounded-2xl object-cover mx-auto" />
                                        {agent.verified && (
                                            <div className="absolute -bottom-1 -end-1 w-6 h-6 bg-aqar-cyan rounded-full flex items-center justify-center">
                                                <BadgeCheck size={13} className="text-aqar-btnText" />
                                            </div>
                                        )}
                                    </div>
                                    <h1 className="text-aqar-text font-bold text-xl mb-1">{agent.name}</h1>
                                    <p className="text-aqar-muted text-sm">{agent.title}</p>
                                    <div className="flex items-center justify-center gap-3 mt-3">
                                        <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded text-amber-500">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-xs font-bold">{agent.rating}</span>
                                        </div>
                                        <span className="text-aqar-muted text-xs">{t("agentsPage.reviews", { count: agent.reviews })}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-aqar-muted mb-6 justify-center">
                                    <span className="flex items-center gap-1.5"><MapPin size={14} /> {t(`compare.cityMap.${agent.location}`, agent.location)}</span>
                                    <span className="flex items-center gap-1.5"><Building2 size={14} /> {agent.company}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="flex-1 bg-aqar-surface border border-aqar-border rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-aqar-text mb-1">{agent.listings || 0}</p>
                                        <p className="text-aqar-muted text-xs">{t("agentsPage.properties")}</p>
                                    </div>
                                    <div className="flex-1 bg-aqar-surface border border-aqar-border rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-aqar-text mb-1">{agent.reviews}</p>
                                        <p className="text-aqar-muted text-xs">{t("agentsPage.reviewsCount")}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <p className="text-xs text-aqar-muted mb-2">{t("agentsPage.languages")}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {agent.languages.map((l: string) => (
                                            <span key={l} className="px-2.5 py-1 text-xs text-aqar-muted border border-aqar-border rounded-lg">{l}</span>
                                        ))}
                                    </div>
                                </div>

                                <a href={`tel:${agent.phone}`}
                                    className="block w-full py-3 bg-aqar-cyan text-aqar-btnText font-semibold text-sm text-center rounded-xl hover:bg-aqar-cyan/90 transition-colors">
                                    {t("agentsPage.contactAdvisor")}
                                </a>
                            </div>
                        </div>

                        {/* Bio + Listings */}
                        <div className="lg:col-span-2">
                            <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-6 lg:p-8 mb-8">
                                <h2 className="text-aqar-text font-semibold text-lg mb-4">{t("agentsPage.bio")}</h2>
                                <p className="text-aqar-muted text-sm leading-relaxed">{agent.bio}</p>
                            </div>

                            <h2 className="text-aqar-text font-semibold text-lg mb-5">{t("agentsPage.activeProperties")} ({properties.length})</h2>
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
