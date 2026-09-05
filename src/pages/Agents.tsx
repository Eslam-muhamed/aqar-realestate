import { useState } from "react";
import { Search } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AgentCard from "@/components/agent/AgentCard";
import { useAgents } from "@/hooks/useRealData";

export default function Agents() {
    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    const { data: agents = [], isLoading } = useAgents();

    const cities = [...new Set(agents.map((a) => a.location))];

    const filtered = agents.filter((a) => {
        const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) ||
            a.company.toLowerCase().includes(search.toLowerCase());
        const matchLocation = !locationFilter || a.location === locationFilter;
        return matchSearch && matchLocation;
    });

    return (
        <div className="min-h-screen bg-aqar-base text-start">
            <Header />
            <div className="pt-16">
                {/* Header */}
                <div className="border-b border-aqar-border bg-aqar-surface/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
                        <p className="text-aqar-cyan text-xs font-medium uppercase tracking-widest mb-4">فريق العمل</p>
                        <h1 className="text-aqar-text text-4xl lg:text-5xl font-bold tracking-tight mb-4">مستشارو العقارات</h1>
                        <p className="text-aqar-muted text-base max-w-xl">
                            إرشادات خبراء ومحترفين ذوي معرفة عميقة بالسوق المحلي.
                        </p>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
                    {/* Search/Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-10">
                        <div className="relative flex-1">
                            <Search size={15} className="absolute start-4 top-1/2 -translate-y-1/2 text-aqar-muted" />
                            <input value={search} onChange={(e) => setSearch(e.target.value)}
                                placeholder="البحث بالاسم أو الشركة..."
                                className="w-full ps-11 pe-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text placeholder-[#98989D]/60 focus:border-aqar-cyan/50 focus:outline-none" />
                        </div>
                        <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}
                            className="px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:outline-none min-w-[160px]">
                            <option value="">جميع المواقع</option>
                            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <p className="text-aqar-muted text-xs mb-6">تم العثور على {filtered.length} من المستشارين</p>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-64 rounded-2xl bg-aqar-border animate-pulse" />
                            ))}
                        </div>
                    ) : filtered.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((a) => <AgentCard key={a.id} agent={a} />)}
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-aqar-text font-medium mb-2">لم يتم العثور على أي مستشارين</p>
                            <p className="text-aqar-muted text-sm">حاول تغيير معايير البحث.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
