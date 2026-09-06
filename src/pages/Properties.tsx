import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import FilterSidebar from "@/components/search/FilterSidebar";
import PropertySkeleton from "@/components/ui/PropertySkeleton";
import { useProperties } from "@/hooks/useRealData";
import type { FilterState, ViewMode } from "@/types";

const DEFAULT_FILTERS: FilterState = {
    status: "all", location: "", type: "", priceMin: "", priceMax: "",
    bedrooms: "", bathrooms: "", areaMin: "", amenities: [],
};

export default function Properties() {
    const { t } = useTranslation();
    const SORT_OPTIONS = [
        { value: "newest", label: t("propertiesPage.sortNewest") },
        { value: "price-asc", label: t("propertiesPage.sortPriceAsc") },
        { value: "price-desc", label: t("propertiesPage.sortPriceDesc") },
        { value: "area-desc", label: t("propertiesPage.sortAreaDesc") },
    ];

    const [searchParams] = useSearchParams();
    const [filters, setFilters] = useState<FilterState>(() => ({
        ...DEFAULT_FILTERS,
        status: (searchParams.get("status") as FilterState["status"]) || "all",
        location: searchParams.get("location") || "",
        type: searchParams.get("type") || "",
        bedrooms: searchParams.get("bedrooms") || "",
    }));
    const [sort, setSort] = useState("newest");
    const [view, setView] = useState<ViewMode>("grid");
    const { data: properties = [], isLoading: loading } = useProperties();
    const [mobileFilters, setMobileFilters] = useState(false);

    // Sync URL search params to local filters state
    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            status: (searchParams.get("status") as FilterState["status"]) || "all",
            location: searchParams.get("location") || "",
            type: searchParams.get("type") || "",
            bedrooms: searchParams.get("bedrooms") || "",
        }));
    }, [searchParams]);

    const filtered = useMemo(() => {
        let results = [...properties];
        if (filters.status !== "all") results = results.filter((p) => p.status === filters.status);
        if (filters.location) results = results.filter((p) => p.location.city === filters.location);
        if (filters.type) results = results.filter((p) => p.type === filters.type);
        if (filters.priceMax) results = results.filter((p) => p.price <= Number(filters.priceMax));
        if (filters.priceMin) results = results.filter((p) => p.price >= Number(filters.priceMin));
        if (filters.bedrooms) {
            const minBeds = filters.bedrooms === "Studio" ? 0 : filters.bedrooms === "5+" ? 5 : Number(filters.bedrooms);
            results = results.filter((p) => p.stats.bedrooms >= minBeds);
        }
        if (filters.amenities.length > 0) {
            results = results.filter((p) => 
                filters.amenities.every((a) => p.amenities.includes(a))
            );
        }

        if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
        else if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
        else if (sort === "area-desc") results.sort((a, b) => b.stats.area - a.stats.area);
        else results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return results;
    }, [filters, sort, properties]);

    return (
        <div className="min-h-screen bg-aqar-base">
            <Header />
            <div className="pt-16">
                {/* Top bar */}
                <div className="border-b border-aqar-border bg-aqar-surface/50">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-5 flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-aqar-text font-semibold text-lg">{t("propertiesPage.propertiesTitle")}</h1>
                            <p className="text-aqar-muted text-sm mt-1">
                                {loading ? t("propertiesPage.loading") : t("propertiesPage.foundProperties", { count: filtered.length })}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileFilters(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-aqar-border rounded-xl text-sm text-aqar-muted hover:text-aqar-text">
                                <SlidersHorizontal size={14} /> {t("propertiesPage.filters")}
                            </button>
                            <select value={sort} onChange={(e) => setSort(e.target.value)}
                                className="px-3 py-2 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text focus:outline-none">
                                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                            <div className="hidden sm:flex border border-aqar-border rounded-xl overflow-hidden">
                                {(["grid", "list"] as ViewMode[]).map((v) => (
                                    <button key={v} onClick={() => setView(v)}
                                        className={`p-2.5 transition-colors ${view === v ? "bg-aqar-hover text-aqar-text" : "text-aqar-muted hover:text-aqar-text"}`}>
                                        {v === "grid" ? <Grid3X3 size={15} /> : <List size={15} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
                    <div className="flex gap-8">
                        {/* Sidebar desktop */}
                        <div className="hidden lg:block w-64 xl:w-72 shrink-0">
                            <div className="sticky top-24">
                                <FilterSidebar filters={filters} onChange={setFilters} />
                            </div>
                        </div>

                        {/* Results */}
                        <div className="flex-1 min-w-0">
                            {loading ? (
                                <div className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                                    {Array.from({ length: 6 }).map((_, i) => <PropertySkeleton key={i} />)}
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-center">
                                    <div className="w-16 h-16 border border-aqar-border rounded-2xl flex items-center justify-center mb-6">
                                        <SlidersHorizontal size={24} className="text-aqar-muted" />
                                    </div>
                                    <h3 className="text-aqar-text font-semibold text-lg mb-2">{t("propertiesPage.noPropertiesFound")}</h3>
                                    <p className="text-aqar-muted text-sm max-w-sm mx-auto mb-6">
                                        {t("propertiesPage.tryAdjustingFilters")}
                                    </p>
                                    <button onClick={() => setFilters(DEFAULT_FILTERS)}
                                        className="mt-6 px-5 py-2.5 border border-aqar-border text-sm text-aqar-text rounded-xl hover:border-aqar-cyan/40">
                                        {t("propertiesPage.clearFilters")}
                                    </button>
                                </div>
                            ) : (
                                <div className={`grid gap-6 ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                                    {filtered.map((p) => <PropertyCard key={p.id} property={p} />)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            {mobileFilters && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFilters(false)} />
                    <div className="absolute bottom-0 inset-x-0 bg-aqar-base rounded-t-2xl max-h-[85vh] overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-aqar-text font-semibold">{t("propertiesPage.filters")}</h3>
                            <button onClick={() => setMobileFilters(false)}>
                                <X size={20} className="text-aqar-muted" />
                            </button>
                        </div>
                        <FilterSidebar filters={filters} onChange={setFilters} onClose={() => setMobileFilters(false)} />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
