import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { MOCK_LOCATIONS, MOCK_PROPERTIES } from "@/constants/mockData";
import { formatPrice } from "@/lib/utils";

export default function LocationDetail() {
    const { slug } = useParams();
    const location = MOCK_LOCATIONS.find((l) => l.slug === slug);
    const properties = MOCK_PROPERTIES.filter((p) => location && p.location.city === location.name);

    if (!location) {
        return (
            <div className="min-h-screen bg-[#121212]">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-white text-lg">Location not found.</p>
                        <Link to="/locations" className="text-[#00E5FF] text-sm mt-4 block">← Back to Locations</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212]">
            <Header />
            <div className="pt-16">
                {/* Hero */}
                <div className="relative h-80 overflow-hidden">
                    <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 max-w-[1440px] mx-auto px-6 lg:px-12 pb-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Link to="/locations" className="text-[#98989D] text-sm hover:text-white transition-colors">Locations</Link>
                            <span className="text-[#98989D]">/</span>
                            <span className="text-white text-sm">{location.name}</span>
                        </div>
                        <h1 className="text-white text-4xl font-bold mb-2">{location.name}</h1>
                        <div className="flex items-center gap-2 text-[#98989D] text-sm">
                            <MapPin size={13} className="text-[#00E5FF]" />
                            <span>{location.country}</span>
                            <span>·</span>
                            <span className="font-mono">{location.properties} listings</span>
                            <span>·</span>
                            <span>Avg {formatPrice(location.avgPrice, "SAR")}</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                    <div className="mb-8">
                        <h2 className="text-white font-semibold text-xl mb-2">
                            Properties in {location.name}
                        </h2>
                        <p className="text-[#98989D] text-sm">{properties.length} properties available</p>
                    </div>

                    {properties.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-[#98989D] text-sm mb-4">No properties listed for this location yet.</p>
                            <Link to="/properties" className="inline-flex items-center gap-2 text-[#00E5FF] text-sm">
                                View all properties <ArrowRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
