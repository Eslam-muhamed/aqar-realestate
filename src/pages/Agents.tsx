import { useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AgentCard from "@/components/agent/AgentCard";
import { useAgents } from "@/hooks/useRealData";
import { useTranslation } from "react-i18next";

export default function Agents() {
    const { t } = useTranslation();
    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    const { data: agents = [], isLoading } = useAgents();

    const cities = [...new Set(agents.map((a) => a.location))];

    const filtered = agents.filter((a) => {
        const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.company.toLowerCase().includes(search.toLowerCase());
        const matchLocation = !locationFilter || a.location === locationFilter;
        return matchSearch && matchLocation;
    });

    return (
        <div className="min-h-screen bg-aqar-base text-start">
            <Header />
            <div className="pt-16">
                {/* Header */}
                <div className="border-b border-aqar-border bg-aqar-surface/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
                        <p className="text-aqar-cyan text-xs font-medium uppercase tracking-widest mb-4">{t("agentsPage.subtitle")}</p>
                        <h1 className="text-aqar-text text-4xl lg:text-5xl font-bold tracking-tight mb-4">{t("agentsPage.title")}</h1>
                        <p className="text-aqar-muted text-base max-w-xl">
                            {t("agentsPage.desc")}
                        </p>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                    {/* Search/Filter */}
                    <p className="text-aqar-muted text-xs mb-6">{t("agentsPage.foundAgents", { count: filtered.length })}</p>
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <div className="relative flex-1">
                            <Search size={18} className="absolute start-4 top-1/2 -translate-y-1/2 text-aqar-muted" />
                            <input value={search} onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("agentsPage.searchPlaceholder")}
                                className="w-full h-12 ps-11 pe-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text placeholder-aqar-muted/50 focus:border-aqar-cyan/50 focus:outline-none transition-colors" />
                        </div>
                        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
                            className="h-12 px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:outline-none min-w-[160px] appearance-none focus:border-aqar-cyan transition-colors">
                            <option value="">{t("agentsPage.allLocations")}</option>
                            {cities.map((c) => <option key={c} value={c}>{t(`compare.cityMap.${c}`, c)}</option>)}
                        </select>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-64 rounded-2xl bg-aqar-border animate-pulse" />
                            ))}
                        </div>
                    ) : filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((a) => <AgentCard key={a.id} agent={a} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-aqar-surface/30 rounded-2xl border border-aqar-border border-dashed">
                            <p className="text-aqar-text font-medium mb-2">{t("agentsPage.notFound")}</p>
                            <p className="text-aqar-muted text-sm">{t("agentsPage.tryChangeFilters")}</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
