import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, Menu, X, ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { label: "شراء", href: "/properties?status=for-sale" },
    { label: "إيجار", href: "/properties?status=for-rent" },
    { label: "المناطق", href: "/locations" },
    { label: "الوكلاء", href: "/agents" },
    { label: "من نحن", href: "/about" },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { favorites } = useFavorites();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    const handleLogout = () => { logout(); setUserMenuOpen(false); navigate("/"); };

    return (
        <header className={cn(
            "fixed top-0 inset-x-0 z-50 transition-all duration-300",
            scrolled ? "bg-[#121212]/95 backdrop-blur-md border-b border-[#2C2C2E]" : "bg-[#121212] border-b border-[#2C2C2E]"
        )}>
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-7 h-7 bg-[#00E5FF] rounded-sm flex items-center justify-center">
                            <span className="text-[#121212] font-bold text-xs font-mono">ع</span>
                        </div>
                        <span className="text-white font-semibold text-lg tracking-tight">عقار</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.label} to={link.href}
                                className={cn("px-4 py-2 text-sm font-medium transition-colors rounded-md",
                                    pathname === link.href.split("?")[0] ? "text-[#00E5FF]" : "text-[#98989D] hover:text-white"
                                )}>
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link to="/properties" className="p-2 text-[#98989D] hover:text-white transition-colors rounded-md" aria-label="البحث">
                            <Search size={18} />
                        </Link>
                        <Link to="/favorites" className="relative p-2 text-[#98989D] hover:text-white transition-colors rounded-md" aria-label="المفضلة">
                            <Heart size={18} />
                            {favorites.length > 0 && (
                                <span className="absolute -top-0.5 -end-0.5 w-4 h-4 bg-[#00E5FF] text-[#121212] rounded-full text-[10px] font-bold flex items-center justify-center">
                                    {favorites.length}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="relative">
                                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 pe-3 ps-2 py-1.5 rounded-md border border-[#2C2C2E] text-sm text-white hover:border-[#00E5FF]/40 transition-colors">
                                    <User size={14} className="text-[#00E5FF]" />
                                    <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                                    <ChevronDown size={12} className="text-[#98989D]" />
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute end-0 top-full mt-2 w-48 bg-[#1E1E1E] border border-[#2C2C2E] rounded-lg py-1 shadow-xl z-50">
                                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#98989D] hover:text-white hover:bg-[#2C2C2E] transition-colors">
                                            <LayoutDashboard size={14} /> لوحة التحكم
                                        </Link>
                                        <button onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#FF453A] hover:bg-[#2C2C2E] transition-colors">
                                            <LogOut size={14} /> تسجيل الخروج
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="px-4 py-2 text-sm text-[#98989D] hover:text-white transition-colors">
                                تسجيل الدخول
                            </Link>
                        )}
                        <Link to="/list-property"
                            className="px-4 py-2 bg-[#00E5FF] text-[#121212] text-sm font-semibold rounded-md hover:bg-[#00E5FF]/90 transition-colors">
                            أضف عقارك
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#98989D]" aria-label="القائمة">
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-[#121212] border-t border-[#2C2C2E] px-6 py-4 space-y-1">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.label} to={link.href}
                            className="block py-3 text-sm font-medium text-[#98989D] hover:text-white border-b border-[#2C2C2E] last:border-0">
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4 flex gap-3">
                        {user ? (
                            <button onClick={handleLogout} className="flex-1 py-2.5 border border-[#2C2C2E] text-sm text-[#FF453A] rounded-md">تسجيل الخروج</button>
                        ) : (
                            <Link to="/login" className="flex-1 py-2.5 border border-[#2C2C2E] text-sm text-center text-[#98989D] rounded-md">تسجيل الدخول</Link>
                        )}
                        <Link to="/list-property" className="flex-1 py-2.5 bg-[#00E5FF] text-[#121212] text-sm font-semibold text-center rounded-md">
                            أضف عقارك
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
