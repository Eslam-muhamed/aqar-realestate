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
        <div className="min-h-screen bg-[#121212]">
            <Header />
            <div className="pt-16">
                <div className="border-b border-[#2C2C2E] bg-[#1E1E1E]/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-white text-3xl font-bold tracking-tight">Saved Properties</h1>
                                <p className="text-[#98989D] text-sm mt-2">
                                    {saved.length} {saved.length === 1 ? "property" : "properties"} saved
                                </p>
                            </div>
                            {saved.length > 0 && (
                                <Link to="/properties" className="flex items-center gap-2 text-sm text-[#98989D] hover:text-white transition-colors group">
                                    Browse more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
                            <div className="w-16 h-16 border border-[#2C2C2E] rounded-2xl flex items-center justify-center mb-6">
                                <Heart size={24} className="text-[#98989D]" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">No saved properties</h3>
                            <p className="text-[#98989D] text-sm max-w-sm mb-8">
                                Save properties you are interested in to find them here quickly.
                            </p>
                            <Link to="/properties"
                                className="px-6 py-3 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl hover:bg-[#00E5FF]/90 transition-colors">
                                Explore Properties
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
