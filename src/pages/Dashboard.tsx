import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Heart, MessageSquare, Home, Settings, Eye, TrendingUp, LayoutDashboard, LogOut, User, Bell } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { inquiriesStorage } from "@/lib/storage";
import { MOCK_PROPERTIES } from "@/constants/mockData";
import { formatPrice } from "@/lib/utils";

type Tab = "overview" | "favorites" | "inquiries" | "settings";

const NAV_TABS = [
    { id: "overview" as Tab, label: "Overview", icon: LayoutDashboard },
    { id: "favorites" as Tab, label: "Saved Properties", icon: Heart },
    { id: "inquiries" as Tab, label: "My Inquiries", icon: MessageSquare },
    { id: "settings" as Tab, label: "Settings", icon: Settings },
];

export default function Dashboard() {
    const { user, logout } = useAuth();
    const { favorites } = useFavorites();
    const [tab, setTab] = useState<Tab>("overview");

    if (!user) return <Navigate to="/login" replace />;

    const savedProperties = MOCK_PROPERTIES.filter((p) => favorites.includes(p.id));
    const inquiries = inquiriesStorage.get();
    const recentlyViewed = MOCK_PROPERTIES.slice(0, 3);

    const KPIs = [
        { label: "Saved Properties", value: favorites.length, icon: Heart, color: "text-[#FF453A]" },
        { label: "Active Inquiries", value: inquiries.length, icon: MessageSquare, color: "text-[#00E5FF]" },
        { label: "Recently Viewed", value: 3, icon: Eye, color: "text-[#32D74B]" },
        { label: "Compared", value: 0, icon: TrendingUp, color: "text-yellow-400" },
    ];

    return (
        <div className="min-h-screen bg-[#121212]">
            <Header />
            <div className="pt-16">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
                    <div className="flex gap-8">
                        {/* Sidebar */}
                        <aside className="hidden lg:block w-64 shrink-0">
                            <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-6 sticky top-24">
                                {/* User Info */}
                                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#2C2C2E]">
                                    <div className="w-10 h-10 bg-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-xl flex items-center justify-center">
                                        <User size={16} className="text-[#00E5FF]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium text-sm truncate">{user.name}</p>
                                        <p className="text-[#98989D] text-xs capitalize">{user.role}</p>
                                    </div>
                                </div>

                                <nav className="space-y-1">
                                    {NAV_TABS.map(({ id, label, icon: Icon }) => (
                                        <button key={id} onClick={() => setTab(id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${tab === id ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "text-[#98989D] hover:text-white hover:bg-[#2C2C2E]"
                                                }`}>
                                            <Icon size={15} /> {label}
                                        </button>
                                    ))}
                                </nav>

                                <div className="mt-6 pt-6 border-t border-[#2C2C2E]">
                                    <button onClick={() => { logout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#FF453A] hover:bg-[#FF453A]/10 transition-colors">
                                        <LogOut size={15} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Mobile Tabs */}
                            <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6">
                                {NAV_TABS.map(({ id, label, icon: Icon }) => (
                                    <button key={id} onClick={() => setTab(id)}
                                        className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-colors ${tab === id ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30" : "border border-[#2C2C2E] text-[#98989D]"
                                            }`}>
                                        <Icon size={13} /> {label}
                                    </button>
                                ))}
                            </div>

                            {/* Overview Tab */}
                            {tab === "overview" && (
                                <div>
                                    <div className="mb-6">
                                        <h1 className="text-white text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}</h1>
                                        <p className="text-[#98989D] text-sm mt-1">Here is what is happening with your account.</p>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                        {KPIs.map(({ label, value, icon: Icon, color }) => (
                                            <div key={label} className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-5">
                                                <Icon size={18} className={`${color} mb-3`} />
                                                <p className="text-white font-mono font-bold text-2xl">{value}</p>
                                                <p className="text-[#98989D] text-xs mt-1">{label}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div>
                                        <h2 className="text-white font-semibold text-base mb-4">Recently Viewed</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {recentlyViewed.map((p) => <PropertyCard key={p.id} property={p} />)}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Favorites Tab */}
                            {tab === "favorites" && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-white font-semibold text-xl">Saved Properties</h2>
                                        <span className="text-[#98989D] text-sm">{savedProperties.length} saved</span>
                                    </div>
                                    {savedProperties.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {savedProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-20 text-center">
                                            <Heart size={32} className="text-[#98989D] mb-4" />
                                            <p className="text-white font-medium mb-2">No saved properties</p>
                                            <Link to="/properties" className="mt-4 px-5 py-2.5 bg-[#00E5FF] text-[#121212] text-sm font-semibold rounded-xl">
                                                Browse Properties
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Inquiries Tab */}
                            {tab === "inquiries" && (
                                <div>
                                    <h2 className="text-white font-semibold text-xl mb-6">My Inquiries</h2>
                                    {inquiries.length > 0 ? (
                                        <div className="space-y-3">
                                            {inquiries.map((inq: any) => (
                                                <div key={inq.id} className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-5 flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{inq.propertyTitle}</p>
                                                        <p className="text-[#98989D] text-xs mt-1 line-clamp-1">{inq.message}</p>
                                                        <p className="text-[#98989D] text-xs mt-2">{new Date(inq.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <span className={`shrink-0 px-2.5 py-1 text-xs rounded-lg font-medium ${inq.status === "new" ? "bg-[#00E5FF]/10 text-[#00E5FF]" : "bg-[#32D74B]/10 text-[#32D74B]"
                                                        }`}>
                                                        {inq.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center py-20 text-center">
                                            <MessageSquare size={32} className="text-[#98989D] mb-4" />
                                            <p className="text-white font-medium mb-2">No inquiries yet</p>
                                            <p className="text-[#98989D] text-sm">Submit an inquiry on a property page to see it here.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Settings Tab */}
                            {tab === "settings" && (
                                <div>
                                    <h2 className="text-white font-semibold text-xl mb-6">Account Settings</h2>
                                    <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-6 max-w-lg">
                                        <h3 className="text-white font-medium text-sm mb-5">Profile Information</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs text-[#98989D] mb-1.5 block">Full Name</label>
                                                <input defaultValue={user.name}
                                                    className="w-full px-4 py-3 bg-[#121212] border border-[#2C2C2E] rounded-xl text-sm text-white focus:border-[#00E5FF]/50 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-[#98989D] mb-1.5 block">Email</label>
                                                <input defaultValue={user.email} type="email"
                                                    className="w-full px-4 py-3 bg-[#121212] border border-[#2C2C2E] rounded-xl text-sm text-white focus:border-[#00E5FF]/50 focus:outline-none" />
                                            </div>
                                            <button className="px-6 py-2.5 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl hover:bg-[#00E5FF]/90 transition-colors">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
