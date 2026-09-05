import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Home, DollarSign, BedDouble } from "lucide-react";
import { CITIES, PROPERTY_TYPES } from "@/constants/mockData";

export default function HeroSearch() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<"for-sale" | "for-rent">("for-sale");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("");
    const [beds, setBeds] = useState("");
    const [priceMax, setPriceMax] = useState("");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (location) params.set("location", location);
        if (type) params.set("type", type.toLowerCase());
        if (beds) params.set("bedrooms", beds);
        if (priceMax) params.set("priceMax", priceMax);
        navigate(`/properties?${params.toString()}`);
    };

    const typeMap: Record<string, string> = { Villa: "فيلا", Apartment: "شقة", Penthouse: "بنتهاوس", Townhouse: "تاون هاوس", Duplex: "دوبلكس", Commercial: "تجاري" };
    const cityMap: Record<string, string> = { Riyadh: "الرياض", Jeddah: "جدة", Dubai: "دبي", "Abu Dhabi": "أبو ظبي", "Al Khobar": "الخبر", Cairo: "القاهرة", Muscat: "مسقط", "Kuwait City": "مدينة الكويت" };

    return (
        <div className="bg-aqar-surface/90 backdrop-blur-md border border-aqar-border rounded-2xl p-2 w-full max-w-4xl text-right" dir="rtl">
            {/* Toggle */}
            <div className="flex gap-1 mb-3 px-1 pt-1">
                {(["for-sale", "for-rent"] as const).map((s) => (
                    <button key={s} onClick={() => setStatus(s)}
                        className={`px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${status === s ? "bg-aqar-cyan text-[#121212]" : "text-aqar-muted hover:text-aqar-text"
                            }`}>
                        {s === "for-sale" ? "شراء" : "استئجار"}
                    </button>
                ))}
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                <div className="relative">
                    <MapPin size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-aqar-muted" />
                    <select value={location} onChange={(e) => setLocation(e.target.value)}
                        className="w-full ps-9 pe-3 py-3 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none appearance-none cursor-pointer">
                        <option value="">أي مدينة</option>
                        {CITIES.map((c) => <option key={c} value={c}>{cityMap[c] || c}</option>)}
                    </select>
                </div>

                <div className="relative">
                    <Home size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-aqar-muted" />
                    <select value={type} onChange={(e) => setType(e.target.value)}
                        className="w-full ps-9 pe-3 py-3 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none appearance-none cursor-pointer">
                        <option value="">نوع العقار</option>
                        {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{typeMap[t] || t}</option>)}
                    </select>
                </div>

                <div className="relative">
                    <DollarSign size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-aqar-muted" />
                    <select value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                        className="w-full ps-9 pe-3 py-3 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none appearance-none cursor-pointer">
                        <option value="">الحد الأقصى للسعر</option>
                        <option value="1000000">1,000,000 ر.س</option>
                        <option value="2000000">2,000,000 ر.س</option>
                        <option value="3000000">3,000,000 ر.س</option>
                        <option value="5000000">5,000,000 ر.س</option>
                        <option value="10000000">10,000,000 ر.س</option>
                    </select>
                </div>

                <div className="relative">
                    <BedDouble size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-aqar-muted" />
                    <select value={beds} onChange={(e) => setBeds(e.target.value)}
                        className="w-full ps-9 pe-3 py-3 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none appearance-none cursor-pointer">
                        <option value="">غرف النوم</option>
                        <option value="0">استوديو</option>
                        {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={String(n)}>+ {n} غرف</option>)}
                    </select>
                </div>
            </div>

            <div className="mt-2 px-1 pb-1">
                <button onClick={handleSearch}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-aqar-cyan text-[#121212] font-semibold text-sm rounded-xl hover:bg-aqar-cyan/90 transition-colors">
                    <Search size={16} />
                    ابحث عن عقارات
                </button>
            </div>
        </div>
    );
}
