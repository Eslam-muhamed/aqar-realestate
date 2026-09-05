import { useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowLeftRight, Plus, BedDouble, Bath, Square, Car, Calendar, MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { MOCK_PROPERTIES } from "@/constants/mockData";
import { compareStorage } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";

const COMPARE_ROWS = [
    { key: "price", label: "Price" },
    { key: "location", label: "Location" },
    { key: "type", label: "Property Type" },
    { key: "area", label: "Total Area" },
    { key: "bedrooms", label: "Bedrooms" },
    { key: "bathrooms", label: "Bathrooms" },
    { key: "parking", label: "Parking" },
    { key: "yearBuilt", label: "Year Built" },
    { key: "status", label: "Listing Type" },
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
        switch (key) {
            case "price": return formatPrice(prop.price, prop.currency) + (prop.status === "for-rent" ? "/yr" : "");
            case "location": return `${prop.location.district}, ${prop.location.city}`;
            case "type": return prop.type.charAt(0).toUpperCase() + prop.type.slice(1);
            case "area": return `${prop.stats.area} m²`;
            case "bedrooms": return prop.stats.bedrooms === 0 ? "Studio" : String(prop.stats.bedrooms);
            case "bathrooms": return String(prop.stats.bathrooms);
            case "parking": return `${prop.stats.parking} spaces`;
            case "yearBuilt": return String(prop.stats.yearBuilt);
            case "status": return prop.status === "for-sale" ? "For Sale" : "For Rent";
            default: return "-";
        }
    };

    return (
        <div className="min-h-screen bg-[#121212]">
            <Header />
            <div className="pt-16">
                <div className="border-b border-[#2C2C2E] bg-[#1E1E1E]/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-white text-3xl font-bold tracking-tight">Compare Properties</h1>
                                <p className="text-[#98989D] text-sm mt-2">Side-by-side comparison of up to 4 properties</p>
                            </div>
                            {properties.length > 0 && (
                                <button onClick={clearAll} className="text-sm text-[#98989D] hover:text-[#FF453A] transition-colors">
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                    {properties.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 border border-[#2C2C2E] rounded-2xl flex items-center justify-center mb-6">
                                <ArrowLeftRight size={24} className="text-[#98989D]" />
                            </div>
                            <h3 className="text-white font-semibold text-lg mb-2">No properties to compare</h3>
                            <p className="text-[#98989D] text-sm max-w-sm mb-8">
                                Use the compare button on property cards to add them here.
                            </p>
                            <Link to="/properties" className="px-6 py-3 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl">
                                Browse Properties
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full" style={{ minWidth: `${properties.length * 240 + 160}px` }}>
                                {/* Property Headers */}
                                <thead>
                                    <tr>
                                        <th className="w-40 text-left" />
                                        {properties.map((p) => (
                                            <th key={p.id} className="px-4 pb-6 text-left align-top">
                                                <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl overflow-hidden">
                                                    <div className="relative">
                                                        <img src={p.images[0]} alt={p.title} className="w-full h-32 object-cover" />
                                                        <button onClick={() => remove(p.id)}
                                                            className="absolute top-2 right-2 w-7 h-7 bg-[#121212]/80 rounded-lg flex items-center justify-center text-white hover:bg-[#FF453A] transition-colors">
                                                            <X size={13} />
                                                        </button>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{p.title}</h3>
                                                        <div className="flex items-center gap-1.5 text-[#98989D] text-xs mb-3">
                                                            <MapPin size={10} /> {p.location.city}
                                                        </div>
                                                        <p className="font-mono text-[#00E5FF] text-base font-bold">
                                                            {formatPrice(p.price, p.currency)}
                                                        </p>
                                                        <Link to={`/property/${p.slug}`}
                                                            className="mt-3 block w-full py-2 border border-[#2C2C2E] text-white text-xs font-medium text-center rounded-xl hover:border-[#00E5FF]/40 transition-colors">
                                                            View Property
                                                        </Link>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
                                        {properties.length < 4 && (
                                            <th className="px-4 pb-6 align-top">
                                                <Link to="/properties"
                                                    className="flex flex-col items-center justify-center w-full h-[280px] border-2 border-dashed border-[#2C2C2E] rounded-2xl hover:border-[#00E5FF]/40 transition-colors group">
                                                    <Plus size={20} className="text-[#98989D] group-hover:text-[#00E5FF] mb-2" />
                                                    <span className="text-[#98989D] text-xs group-hover:text-[#00E5FF]">Add Property</span>
                                                </Link>
                                            </th>
                                        )}
                                    </tr>
                                </thead>

                                {/* Comparison Rows */}
                                <tbody>
                                    {COMPARE_ROWS.map((row, ri) => (
                                        <tr key={row.key} className={ri % 2 === 0 ? "bg-[#1E1E1E]/30" : ""}>
                                            <td className="py-4 pr-4 text-[#98989D] text-xs font-medium">{row.label}</td>
                                            {properties.map((p) => (
                                                <td key={p.id} className={`px-4 py-4 text-sm ${row.key === "price" ? "text-[#00E5FF] font-mono font-semibold" : "text-white"}`}>
                                                    {getValue(p, row.key)}
                                                </td>
                                            ))}
                                            {properties.length < 4 && <td />}
                                        </tr>
                                    ))}

                                    {/* Features */}
                                    <tr>
                                        <td className="py-4 pr-4 text-[#98989D] text-xs font-medium align-top">Features</td>
                                        {properties.map((p) => (
                                            <td key={p.id} className="px-4 py-4 align-top">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {p.features.slice(0, 4).map((f) => (
                                                        <span key={f} className="px-2 py-1 text-xs text-[#98989D] border border-[#2C2C2E] rounded-lg">{f}</span>
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
