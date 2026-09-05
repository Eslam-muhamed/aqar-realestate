import { useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AgentCard from "@/components/agent/AgentCard";
import { MOCK_AGENTS } from "@/constants/mockData";

export default function Agents() {
    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    const cities = [...new Set(MOCK_AGENTS.map((a) => a.location))];

    const filtered = MOCK_AGENTS.filter((a) => {
        const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.company.toLowerCase().includes(search.toLowerCase());
        const matchLocation = !locationFilter || a.location === locationFilter;
        return matchSearch && matchLocation;
    });

    return (
        <div className="min-h-screen bg-[#121212]">
            <Header />
            <div className="pt-16">
                {/* Header */}
                <div className="border-b border-[#2C2C2E] bg-[#1E1E1E]/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
                        <p className="text-[#00E5FF] text-xs font-medium uppercase tracking-widest mb-4">Our Team</p>
                        <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tight mb-4">Property Consultants</h1>
                        <p className="text-[#98989D] text-base max-w-xl">
                            Expert guidance from professionals with deep knowledge of their local markets.
                        </p>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
                    {/* Search/Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98989D]" />
                            <input value={search} onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or company..."
                                className="w-full pl-11 pr-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/60 focus:border-[#00E5FF]/50 focus:outline-none" />
                        </div>
                        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
                            className="px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white focus:outline-none min-w-[160px]">
                            <option value="">All Locations</option>
                            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <p className="text-[#98989D] text-xs mb-6">{filtered.length} agents found</p>

                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((a) => <AgentCard key={a.id} agent={a} />)}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-white font-medium mb-2">No agents found</p>
                            <p className="text-[#98989D] text-sm">Try adjusting your search criteria.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
