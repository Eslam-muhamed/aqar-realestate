import { X } from "lucide-react";
import { CITIES, PROPERTY_TYPES } from "@/constants/mockData";
import { Input } from "@/components/ui/input";
import type { FilterState } from "@/types";
import { useTranslation } from "react-i18next";

interface Props {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
    onClose?: () => void;
}

const PRICE_OPTIONS = [
    { label: "500K", value: "500000" }, { label: "1M", value: "1000000" },
    { label: "2M", value: "2000000" }, { label: "3M", value: "3000000" },
    { label: "5M", value: "5000000" }, { label: "10M", value: "10000000" },
];

export default function FilterSidebar({ filters, onChange, onClose }: Props) {
    const { t } = useTranslation();
    const set = (key: keyof FilterState, value: FilterState[keyof FilterState]) =>
        onChange({ ...filters, [key]: value });

    const hasActive = Object.values(filters).some((v) => v !== "" && v !== "all" && v !== false);

    const clear = () => onChange({
        status: "all", location: "", type: "", priceMin: "", priceMax: "",
        bedrooms: "", bathrooms: "", areaMin: "", furnished: false, parking: false, pool: false, garden: false,
    });

    const typeMap: Record<string, string> = { Villa: "فيلا", Apartment: "شقة", Penthouse: "بنتهاوس", Townhouse: "تاون هاوس", Duplex: "دوبلكس", Commercial: "تجاري" };
    const cityMap: Record<string, string> = { Riyadh: "الرياض", Jeddah: "جدة", Dubai: "دبي", "Abu Dhabi": "أبو ظبي", "Al Khobar": "الخبر", Cairo: "القاهرة", Muscat: "مسقط", "Kuwait City": "مدينة الكويت" };

    return (
        <aside className="bg-aqar-surface border border-aqar-border rounded-2xl p-6 text-start shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-aqar-text font-semibold text-sm">الفلاتر</h3>
                <div className="flex items-center gap-2">
                    {hasActive && (
                        <button onClick={clear} className="text-xs text-aqar-cyan hover:text-aqar-cyan/80 transition-colors">
                            مسح الكل
                        </button>
                    )}
                    {onClose && (
                        <button onClick={onClose} className="text-aqar-muted hover:text-aqar-text lg:hidden">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {/* Status */}
                <div>
                    <p className="text-xs text-aqar-muted font-medium uppercase tracking-wider mb-3 text-start">نوع العرض</p>
                    <div className="flex gap-2">
                        {(["all", "for-sale", "for-rent"] as const).map((s) => (
                            <button key={s} onClick={() => set("status", s)}
                                className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-colors ${filters.status === s
                                        ? "border-aqar-cyan bg-aqar-cyan/10 text-aqar-cyan"
                                        : "border-aqar-border text-aqar-muted hover:text-aqar-text"
                                    }`}>
                                {s === "all" ? "الكل" : s === "for-sale" ? "للبيع" : "للإيجار"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <p className="text-xs text-aqar-muted font-medium uppercase tracking-wider mb-3 text-start">الموقع</p>
                    <select value={filters.location} onChange={(e) => set("location", e.target.value)}
                        className="w-full px-3 py-2.5 bg-aqar-base border border-aqar-border rounded-lg text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none">
                        <option value="">أي مدينة</option>
                        {CITIES.map((c) => <option key={c} value={c}>{cityMap[c] || c}</option>)}
                    </select>
                </div>

                {/* Type */}
                <div>
                    <p className="text-xs text-aqar-muted font-medium uppercase tracking-wider mb-3 text-start">نوع العقار</p>
                    <div className="grid grid-cols-2 gap-2">
                        {PROPERTY_TYPES.map((t) => (
                            <button key={t} onClick={() => set("type", filters.type === t.toLowerCase() ? "" : t.toLowerCase())}
                                className={`py-2 text-xs font-medium rounded-lg border transition-colors ${filters.type === t.toLowerCase()
                                        ? "border-aqar-cyan bg-aqar-cyan/10 text-aqar-cyan"
                                        : "border-aqar-border text-aqar-muted hover:text-aqar-text"
                                    }`}>
                                {typeMap[t] || t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div>
                    <p className="text-xs text-aqar-muted font-medium uppercase tracking-wider mb-3 text-start">{t("search.priceRange", "نطاق السعر (ر.س)")}</p>
                    <div className="flex items-center gap-2">
                        <Input 
                            type="number" 
                            placeholder={t("search.min", "الحد الأدنى")}
                            value={filters.priceMin} 
                            onChange={(e) => set("priceMin", e.target.value)}
                            className="bg-aqar-base border-aqar-border text-aqar-text h-9 text-xs"
                        />
                        <span className="text-aqar-muted">-</span>
                        <Input 
                            type="number" 
                            placeholder={t("search.max", "الحد الأقصى")} 
                            value={filters.priceMax} 
                            onChange={(e) => set("priceMax", e.target.value)}
                            className="bg-aqar-base border-aqar-border text-aqar-text h-9 text-xs"
                        />
                    </div>
                </div>

                {/* Bedrooms */}
                <div>
                    <p className="text-xs text-aqar-muted font-medium uppercase tracking-wider mb-3 text-start">الحد الأدنى لغرف النوم</p>
                    <div className="flex gap-1.5 flex-wrap">
                        {["Studio", "1", "2", "3", "4", "5+"].map((b) => (
                            <button key={b} onClick={() => set("bedrooms", filters.bedrooms === b ? "" : b)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${filters.bedrooms === b
                                        ? "border-aqar-cyan bg-aqar-cyan/10 text-aqar-cyan"
                                        : "border-aqar-border text-aqar-muted hover:text-aqar-text"
                                    }`} dir="ltr">
                                {b === "Studio" ? "استوديو" : b}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amenities */}
                <div>
                    <p className="text-xs text-aqar-muted font-medium uppercase tracking-wider mb-3 text-start">المميزات</p>
                    <div className="space-y-2.5">
                        {[
                            { key: "furnished" as const, label: "مفروشة" },
                            { key: "parking" as const, label: "موقف سيارات" },
                            { key: "pool" as const, label: "مسبح" },
                            { key: "garden" as const, label: "حديقة" },
                        ].map(({ key, label }) => (
                            <label key={key} className="flex items-center justify-between cursor-pointer group">
                                <span className={`text-sm transition-colors ${filters[key] ? "text-aqar-text" : "text-aqar-muted group-hover:text-aqar-text"}`}>{label}</span>
                                <div onClick={() => set(key, !filters[key])}
                                    className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${filters[key] ? "bg-aqar-cyan" : "bg-[#2C2C2E]"}`}>
                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${filters[key] ? "-translate-x-4" : "-translate-x-0.5"}`} />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}
