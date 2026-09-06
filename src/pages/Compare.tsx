import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowLeftRight, Plus, MapPin, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useProperties } from "@/hooks/useRealData";
import { compareStorage } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";

export default function Compare() {
    const { t } = useTranslation();
    const COMPARE_FEATURES = [
        { key: "price", label: t("compare.price") },
        { key: "location", label: t("compare.location") },
        { key: "type", label: t("compare.type") },
        { key: "area", label: t("compare.area") },
        { key: "bedrooms", label: t("compare.bedrooms") },
        { key: "bathrooms", label: t("compare.bathrooms") },
        { key: "parking", label: t("compare.parking") },
        { key: "yearBuilt", label: t("compare.yearBuilt") },
        { key: "status", label: t("compare.status") },
    ];

    const [compareIds, setCompareIds] = useState<string[]>(() => compareStorage.get());
    const { data: allProperties = [] } = useProperties();
    const properties = allProperties.filter((p) => compareIds.includes(p.id));

    const remove = (id: string) => {
        compareStorage.remove(id);
        setCompareIds(compareStorage.get());
    };
    const clearAll = () => {
        compareStorage.clear();
        setCompareIds([]);
    };

    const getValue = (prop: typeof properties[0], key: string): string => {
        switch (key) {
            case "price": return formatPrice(prop.price, prop.currency) + (prop.status === "for-rent" ? t("compare.yearly") : "");
            case "location": return `${prop.location.district || ""}، ${t(`compare.cityMap.${prop.location.city}`, prop.location.city)}`;
            case "type": return t(`compare.typeMap.${prop.type.toLowerCase()}`, prop.type);
            case "area": return `${prop.stats.area} م²`;
            case "bedrooms": return prop.stats.bedrooms === 0 ? t("compare.studio") : String(prop.stats.bedrooms);
            case "bathrooms": return String(prop.stats.bathrooms);
            case "parking": return `${prop.stats.parking} ${t("compare.parkingSpace")}`;
            case "yearBuilt": return String(prop.stats.yearBuilt);
            case "status": return prop.status === "for-sale" ? t("compare.forSale") : t("compare.forRent");
            default: return "-";
        }
    };

    return (
        <div className="min-h-screen bg-aqar-base text-start">
            <Header />
            <div className="pt-16">
                <div className="border-b border-aqar-border bg-aqar-surface/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-aqar-text text-3xl font-bold tracking-tight">{t("compare.title")}</h1>
                                <p className="text-aqar-muted text-sm mt-2">{t("compare.subtitle")}</p>
                            </div>
                            {properties.length > 0 && (
                                <button onClick={clearAll} className="text-aqar-muted hover:text-red-500 text-sm font-medium transition-colors">
                                    {t("compare.clearAll")}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                    {properties.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 bg-aqar-surface border border-aqar-border rounded-2xl flex items-center justify-center mb-6 shadow-sm dark:shadow-none">
                                <ArrowLeftRight size={24} className="text-aqar-muted" />
                            </div>
                            <h3 className="text-aqar-text font-semibold text-lg mb-2">{t("compare.emptyTitle")}</h3>
                            <p className="text-aqar-muted text-sm max-w-sm mx-auto mb-6">
                                {t("compare.emptyDesc")}
                            </p>
                            <Link to="/properties" className="inline-flex items-center gap-2 bg-aqar-cyan text-white px-6 py-3 rounded-xl hover:bg-aqar-cyan/90 transition-colors">
                                {t("compare.browseProps")} <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full" style={{ minWidth: `${properties.length * 240 + 160}px` }}>
                                <thead>
                                    <tr>
                                        <th className="w-40 text-start" />
                                        {properties.map((p) => (
                                            <th key={p.id} className="px-4 pb-6 text-start align-top">
                                                <div className="bg-aqar-surface border border-aqar-border rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                                                    <div className="relative">
                                                        <img src={p.images[0]} alt={p.title} className="w-full h-32 object-cover" />
                                                        <button onClick={() => remove(p.id)}
                                                            className="absolute top-2 end-2 w-7 h-7 bg-aqar-base/80 rounded-lg flex items-center justify-center text-aqar-text hover:bg-red-500 hover:text-white transition-colors">
                                                            <X size={13} />
                                                        </button>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="text-aqar-text font-semibold text-sm mb-1 line-clamp-2">{p.title}</h3>
                                                        <div className="flex items-center gap-1.5 text-aqar-muted text-xs mb-3">
                                                            <MapPin size={10} /> {p.location.city}
                                                        </div>
                                                        <p className="font-mono text-aqar-cyan text-base font-bold text-start" dir="ltr">
                                                            {formatPrice(p.price, p.currency)}
                                                        </p>
                                                        <Link to={`/property/${p.slug}`}
                                                            className="w-full mt-4 flex items-center justify-center gap-2 bg-aqar-surface border border-aqar-border text-aqar-text text-xs py-2 rounded-lg hover:border-aqar-cyan hover:text-aqar-cyan transition-colors">
                                                            {t("compare.viewProp")}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
                                        {properties.length < 4 && (
                                            <th className="px-4 pb-6 align-top">
                                                <Link to="/properties" className="flex flex-col items-center justify-center w-full h-[280px] border-2 border-dashed border-aqar-border rounded-2xl hover:border-aqar-cyan/40 transition-colors group">
                                                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-aqar-border flex items-center justify-center text-aqar-muted mb-3 group-hover:border-aqar-cyan group-hover:text-aqar-cyan transition-colors">
                                                        <Plus size={20} />
                                                    </div>
                                                    <span className="text-aqar-muted text-xs group-hover:text-aqar-cyan">{t("compare.addProp")}</span>
                                                </Link>
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARE_FEATURES.map((row, ri) => (
                                        <tr key={row.key} className={ri % 2 === 0 ? "bg-aqar-surface/30" : ""}>
                                            <td className="py-4 pe-4 text-aqar-muted text-xs font-medium">{row.label}</td>
                                            {properties.map((p) => (
                                                <td key={p.id} className={`px-4 py-4 text-sm ${row.key === "price" ? "text-aqar-cyan font-mono font-semibold text-start" : "text-aqar-text"}`} dir={row.key === "price" ? "ltr" : "auto"}>
                                                    {getValue(p, row.key)}
                                                </td>
                                            ))}
                                            {properties.length < 4 && <td />}
                                        </tr>
                                    ))}
                                    <tr className="border-t border-aqar-border">
                                        <td className="py-4 pe-4 text-aqar-muted text-xs font-medium align-top">{t("compare.features")}</td>
                                        {properties.map(p => (
                                            <td key={`${p.id}-features`} className="py-4 px-4 border-s border-aqar-border align-top">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {p.features.slice(0, 4).map((f) => (
                                                        <span key={f} className="px-2 py-1 text-xs text-aqar-muted border border-aqar-border rounded-lg">{f}</span>
                                                    ))}
                                                </div>
                                            </td>
                                        ))}
                                        {properties.length < 4 && <td />}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
