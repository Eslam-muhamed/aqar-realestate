import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Home } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MOCK_LOCATIONS } from "@/constants/mockData";
import { formatPrice } from "@/lib/utils";

export default function Locations() {
    return (
        <div className="min-h-screen bg-[#121212] text-right" dir="rtl">
            <Header />
            <div className="pt-16">
                {/* Header */}
                <div className="border-b border-[#2C2C2E] bg-[#1E1E1E]/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
                        <p className="text-[#00E5FF] text-xs font-medium uppercase tracking-widest mb-4">مناطق عملنا</p>
                        <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tight mb-4">الأسواق الرئيسية</h1>
                        <p className="text-[#98989D] text-base max-w-xl">
                            نعمل في أنشط أسواق العقارات في المملكة العربية السعودية ومنطقة الشرق الأوسط وشمال أفريقيا.
                        </p>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {MOCK_LOCATIONS.map((loc) => {
                            const typeMap: Record<string, string> = { Villa: "فيلا", Apartment: "شقة", Penthouse: "بنتهاوس", Townhouse: "تاون هاوس", Duplex: "دوبلكس", Commercial: "تجاري" };
                            const countryMap: Record<string, string> = { "Saudi Arabia": "السعودية", "UAE": "الإمارات", "Egypt": "مصر", "Oman": "عُمان", "Kuwait": "الكويت" };
                            const nameMap: Record<string, string> = { Riyadh: "الرياض", Jeddah: "جدة", Dubai: "دبي", "Abu Dhabi": "أبو ظبي", "Al Khobar": "الخبر", Cairo: "القاهرة", Muscat: "مسقط", "Kuwait City": "مدينة الكويت" };
                            
                            return (
                            <Link key={loc.id} to={`/locations/${loc.slug}`}
                                className="group bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl overflow-hidden hover:border-[#3C3C3E] hover:-translate-y-1 transition-all duration-300">
                                <div className="relative aspect-video overflow-hidden">
                                    <img src={loc.image} alt={loc.name} loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-3 start-3 flex items-center gap-1.5">
                                        <MapPin size={11} className="text-[#00E5FF]" />
                                        <span className="text-white/70 text-xs">{countryMap[loc.country] || loc.country}</span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-[#00E5FF] transition-colors">{nameMap[loc.name] || loc.name}</h3>
                                    <p className="text-[#98989D] text-xs leading-relaxed mb-4 line-clamp-2">{loc.description}</p>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-[#121212] border border-[#2C2C2E] rounded-xl p-3">
                                            <p className="text-white font-mono font-semibold text-sm">{loc.properties}</p>
                                            <p className="text-[#98989D] text-xs flex items-center gap-1 mt-0.5">
                                                <Home size={10} /> عقارات
                                            </p>
                                        </div>
                                        <div className="bg-[#121212] border border-[#2C2C2E] rounded-xl p-3">
                                            <p className="text-white font-mono font-semibold text-xs truncate" dir="ltr">{formatPrice(loc.avgPrice, "SAR").replace("SAR ", "")}</p>
                                            <p className="text-[#98989D] text-xs mt-0.5">متوسط السعر</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {loc.types.slice(0, 3).map((t) => (
                                            <span key={t} className="px-2.5 py-1 text-xs text-[#98989D] border border-[#2C2C2E] rounded-lg">{typeMap[t] || t}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[#00E5FF] text-xs font-medium group-hover:gap-3 transition-all">
                                        استكشف العقارات <ArrowRight size={12} className="rotate-180" />
                                    </div>
                                </div>
                            </Link>
                        )})}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
