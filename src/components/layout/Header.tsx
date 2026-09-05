import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Heart, ArrowLeftRight, Menu, X, ChevronDown, LayoutDashboard, LogOut, User, Sun, Moon, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useCompare } from "@/hooks/useCompare";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { pathname, search } = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { favorites } = useFavorites();
    const { compareList } = useCompare();
    const { t, i18n } = useTranslation();
    const { theme, setTheme } = useTheme();

    const NAV_LINKS = [
        { label: t("nav.buy"), href: "/properties?status=for-sale" },
        { label: t("nav.rent"), href: "/properties?status=for-rent" },
        { label: t("nav.locations"), href: "/locations" },
        { label: t("nav.agents"), href: "/agents" },
        { label: t("nav.about"), href: "/about" },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => { setMobileOpen(false); }, [pathname]);

    const handleLogout = () => { logout(); setUserMenuOpen(false); navigate("/"); };

    const toggleLanguage = () => {
        const newLang = i18n.language === "ar" ? "en" : "ar";
        i18n.changeLanguage(newLang);
    };

    return (
        <header className={cn(
            "fixed top-0 inset-x-0 z-50 transition-all duration-300",
            scrolled ? "bg-aqar-base/95 backdrop-blur-md border-b border-aqar-border" : "bg-aqar-base border-b border-aqar-border"
        )}>
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-7 h-7 bg-aqar-cyan rounded-sm flex items-center justify-center">
                            <span className="text-aqar-base font-bold text-xs font-mono">ع</span>
                        </div>
                        <span className="text-aqar-text font-semibold text-lg tracking-tight">عقار</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link) => {
                            const isActive = link.href.includes("?") 
                                ? pathname + search === link.href
                                : pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/");

                            return (
                                <Link key={link.label} to={link.href}
                                    className={cn("px-4 py-2 text-sm font-medium transition-colors rounded-md",
                                        isActive ? "text-aqar-cyan" : "text-aqar-muted hover:text-aqar-text"
                                    )}>
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 text-aqar-muted hover:text-aqar-text transition-colors rounded-md" aria-label={t("nav.theme")}>
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* Language Toggle */}
                        <button onClick={toggleLanguage}
                            className="flex items-center gap-1.5 p-2 text-sm font-medium text-aqar-muted hover:text-aqar-text transition-colors rounded-md">
                            <Globe size={18} />
                            <span>{t("nav.language")}</span>
                        </button>

                        <Link to="/properties" className="p-2 text-aqar-muted hover:text-aqar-text transition-colors rounded-md" aria-label={t("nav.search")}>
                            <Search size={18} />
                        </Link>
                        <Link to="/favorites" className="relative p-2 text-aqar-muted hover:text-aqar-text transition-colors rounded-md" aria-label={t("nav.favorites")}>
                            <Heart size={18} />
                            {favorites.length > 0 && (
                                <span className="absolute -top-0.5 -end-0.5 w-4 h-4 bg-aqar-cyan text-aqar-base rounded-full text-[10px] font-bold flex items-center justify-center">
                                    {favorites.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/compare" className="relative p-2 text-aqar-muted hover:text-aqar-text transition-colors rounded-md" aria-label="Compare">
                            <ArrowLeftRight size={18} />
                            {compareList.length > 0 && (
                                <span className="absolute -top-0.5 -end-0.5 w-4 h-4 bg-aqar-cyan text-aqar-base rounded-full text-[10px] font-bold flex items-center justify-center">
                                    {compareList.length}
                                </span>
                            )}
                        </Link>
                        {user ? (
                            <div className="relative">
                                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 pe-3 ps-2 py-1.5 rounded-md border border-aqar-border text-sm text-aqar-text hover:border-aqar-cyan/40 transition-colors">
                                    <User size={14} className="text-aqar-cyan" />
                                    <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                                    <ChevronDown size={12} className="text-aqar-muted" />
                                </button>
                                {userMenuOpen && (
                                    <div className="absolute end-0 top-full mt-2 w-48 bg-aqar-surface border border-aqar-border rounded-lg py-1 shadow-xl z-50">
                                        <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-aqar-muted hover:text-aqar-text hover:bg-aqar-border/50 transition-colors">
                                            <LayoutDashboard size={14} /> {t("nav.dashboard")}
                                        </Link>
                                        <button onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-aqar-danger hover:bg-aqar-border/50 transition-colors">
                                            <LogOut size={14} /> {t("nav.logout")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="px-4 py-2 text-sm text-aqar-muted hover:text-aqar-text transition-colors">
                                {t("nav.login")}
                            </Link>
                        )}
                        {user && (user.role === "admin" || user.role === "supervisor") && (
                            <Link to="/list-property"
                                className="px-4 py-2 bg-aqar-cyan text-aqar-base text-sm font-semibold rounded-md hover:bg-aqar-cyan/90 transition-colors">
                                {t("nav.addProperty")}
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="p-2 text-aqar-muted" aria-label={t("nav.theme")}>
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button onClick={toggleLanguage}
                            className="p-2 text-aqar-muted" aria-label={t("nav.language")}>
                            <Globe size={18} />
                        </button>
                        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-aqar-muted" aria-label="Menu">
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-aqar-base border-t border-aqar-border px-6 py-4 space-y-1">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.label} to={link.href}
                            className="block py-3 text-sm font-medium text-aqar-muted hover:text-aqar-text border-b border-aqar-border last:border-0">
                            {link.label}
                        </Link>
                    ))}
                    <Link to="/favorites" className="flex items-center justify-between py-3 text-sm font-medium text-aqar-muted hover:text-aqar-text border-b border-aqar-border">
                        <span>{t("nav.favorites")}</span>
                        {favorites.length > 0 && (
                            <span className="w-5 h-5 bg-aqar-cyan text-aqar-base rounded-full text-xs font-bold flex items-center justify-center">
                                {favorites.length}
                            </span>
                        )}
                    </Link>
                    <Link to="/compare" className="flex items-center justify-between py-3 text-sm font-medium text-aqar-muted hover:text-aqar-text border-b border-aqar-border">
                        <span>المقارنة</span>
                        {compareList.length > 0 && (
                            <span className="w-5 h-5 bg-aqar-cyan text-aqar-base rounded-full text-xs font-bold flex items-center justify-center">
                                {compareList.length}
                            </span>
                        )}
                    </Link>
                    <div className="pt-4 flex gap-3">
                        {user ? (
                            <button onClick={handleLogout} className="flex-1 py-2.5 border border-aqar-border text-sm text-aqar-danger rounded-md">{t("nav.logout")}</button>
                        ) : (
                            <Link to="/login" className="flex-1 py-2.5 border border-aqar-border text-sm text-center text-aqar-muted rounded-md">{t("nav.login")}</Link>
                        )}
                        {user && (user.role === "admin" || user.role === "supervisor") && (
                            <Link to="/list-property" className="flex-1 py-2.5 bg-aqar-cyan text-aqar-base text-sm font-semibold text-center rounded-md">
                                {t("nav.addProperty")}
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
