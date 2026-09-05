import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { MOCK_PROPERTIES } from "@/constants/mockData";
import { useFavorites } from "@/hooks/useFavorites";

export default function Favorites() {
    const { favorites } = useFavorites();
    const saved = MOCK_PROPERTIES.filter((p) => favorites.includes(p.id));

    return (
        <div className="min-h-screen bg-aqar-base text-right" dir="rtl">
            <Header />
            <div className="pt-16">
                <div className="border-b border-aqar-border bg-aqar-surface/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-aqar-text text-3xl font-bold tracking-tight">العقارات المحفوظة</h1>
                                <p className="text-aqar-muted text-sm mt-2">
                                    {saved.length} {saved.length === 1 ? "عقار محفوظ" : "عقارات محفوظة"}
                                </p>
                            </div>
                            {saved.length > 0 && (
                                <Link to="/properties" className="flex items-center gap-2 text-sm text-aqar-muted hover:text-aqar-text transition-colors group">
                                    تصفح المزيد <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                    {saved.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {saved.map((p) => <PropertyCard key={p.id} property={p} />)}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 border border-aqar-border rounded-2xl flex items-center justify-center mb-6">
                                <Heart size={24} className="text-aqar-muted" />
                            </div>
                            <h3 className="text-aqar-text font-semibold text-lg mb-2">لا توجد عقارات محفوظة</h3>
                            <p className="text-aqar-muted text-sm max-w-sm mb-8">
                                احفظ العقارات التي تهتم بها لتجدها هنا بسهولة.
                            </p>
                            <Link to="/properties"
                                className="px-6 py-3 bg-aqar-cyan text-[#121212] font-semibold text-sm rounded-xl hover:bg-aqar-cyan/90 transition-colors">
                                استكشف العقارات
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
