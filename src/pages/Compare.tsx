import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowLeftRight, Plus, BedDouble, Bath, Square, Car, Calendar, MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MOCK_PROPERTIES } from "@/constants/mockData";
import { compareStorage } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";

const COMPARE_ROWS = [
    { key: "price", label: "السعر" },
    { key: "location", label: "الموقع" },
    { key: "type", label: "نوع العقار" },
    { key: "area", label: "المساحة الإجمالية" },
    { key: "bedrooms", label: "غرف النوم" },
    { key: "bathrooms", label: "دورات المياه" },
    { key: "parking", label: "مواقف السيارات" },
    { key: "yearBuilt", label: "سنة البناء" },
    { key: "status", label: "نوع العرض" },
];

export default function Compare() {
    const [compareIds, setCompareIds] = useState<string[]>(() => compareStorage.get());
    const properties = MOCK_PROPERTIES.filter((p) => compareIds.includes(p.id));

    const remove = (id: string) => {
        compareStorage.remove(id);
        setCompareIds(compareStorage.get());
    };
    const clearAll = () => {
        compareStorage.clear();
        setCompareIds([]);
    };

    const getValue = (prop: typeof properties[0], key: string): string => {
        const typeMap: Record<string, string> = { villa: "فيلا", apartment: "شقة", penthouse: "بنتهاوس", townhouse: "تاون هاوس", duplex: "دوبلكس", commercial: "تجاري" };
        const cityMap: Record<string, string> = { Riyadh: "الرياض", Jeddah: "جدة", Dubai: "دبي", "Abu Dhabi": "أبو ظبي", "Al Khobar": "الخبر", Cairo: "القاهرة", Muscat: "مسقط", "Kuwait City": "مدينة الكويت" };
        switch (key) {
            case "price": return formatPrice(prop.price, prop.currency) + (prop.status === "for-rent" ? " / سنوياً" : "");
            case "location": return `${prop.location.district || ""}، ${cityMap[prop.location.city] || prop.location.city}`;
            case "type": return typeMap[prop.type] || prop.type;
            case "area": return `${prop.stats.area} م²`;
            case "bedrooms": return prop.stats.bedrooms === 0 ? "استوديو" : String(prop.stats.bedrooms);
            case "bathrooms": return String(prop.stats.bathrooms);
            case "parking": return `${prop.stats.parking} مواقف`;
            case "yearBuilt": return String(prop.stats.yearBuilt);
            case "status": return prop.status === "for-sale" ? "للبيع" : "للإيجار";
            default: return "-";
        }
    };

    return (
        <div className="min-h-screen bg-aqar-base text-right" dir="rtl">
            <Header />
            <div className="pt-16">
                <div className="border-b border-aqar-border bg-aqar-surface/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-aqar-text text-3xl font-bold tracking-tight">مقارنة العقارات</h1>
                                <p className="text-aqar-muted text-sm mt-2">مقارنة حتى 4 عقارات جنباً إلى جنب</p>
                            </div>
                            {properties.length > 0 && (
                                <button onClick={clearAll} className="text-sm text-aqar-muted hover:text-[#FF453A] transition-colors">
                                    مسح الكل
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                    {properties.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 border border-aqar-border rounded-2xl flex items-center justify-center mb-6">
                                <ArrowLeftRight size={24} className="text-aqar-muted" />
                            </div>
                            <h3 className="text-aqar-text font-semibold text-lg mb-2">لا توجد عقارات للمقارنة</h3>
                            <p className="text-aqar-muted text-sm max-w-sm mb-8">
                                استخدم زر المقارنة على بطاقات العقار لإضافتها هنا.
                            </p>
                            <Link to="/properties" className="px-6 py-3 bg-aqar-cyan text-[#121212] font-semibold text-sm rounded-xl">
                                تصفح العقارات
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full" style={{ minWidth: `${properties.length * 240 + 160}px` }}>
                                {/* Property Headers */}
                                <thead>
                                    <tr>
                                        <th className="w-40 text-start" />
                                        {properties.map((p) => (
                                            <th key={p.id} className="px-4 pb-6 text-start align-top">
                                                <div className="bg-aqar-surface border border-aqar-border rounded-2xl overflow-hidden">
                                                    <div className="relative">
                                                        <img src={p.images[0]} alt={p.title} className="w-full h-32 object-cover" />
                                                        <button onClick={() => remove(p.id)}
                                                            className="absolute top-2 end-2 w-7 h-7 bg-aqar-base/80 rounded-lg flex items-center justify-center text-aqar-text hover:bg-[#FF453A] transition-colors">
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
                                                            className="mt-3 block w-full py-2 border border-aqar-border text-aqar-text text-xs font-medium text-center rounded-xl hover:border-aqar-cyan/40 transition-colors">
                                                            عرض العقار
                                                        </Link>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
                                        {properties.length < 4 && (
                                            <th className="px-4 pb-6 align-top">
                                                <Link to="/properties"
                                                    className="flex flex-col items-center justify-center w-full h-[280px] border-2 border-dashed border-aqar-border rounded-2xl hover:border-aqar-cyan/40 transition-colors group">
                                                    <Plus size={20} className="text-aqar-muted group-hover:text-aqar-cyan mb-2" />
                                                    <span className="text-aqar-muted text-xs group-hover:text-aqar-cyan">إضافة عقار</span>
                                                </Link>
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                {/* Comparison Rows */}
                                <tbody>
                                    {COMPARE_ROWS.map((row, ri) => (
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

                                    {/* Features */}
                                    <tr>
                                        <td className="py-4 pe-4 text-aqar-muted text-xs font-medium align-top">المميزات</td>
                                        {properties.map((p) => (
                                            <td key={p.id} className="px-4 py-4 align-top">
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
