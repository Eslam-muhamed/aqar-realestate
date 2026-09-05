import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
    Heart,
    MessageSquare,
    Home,
    Settings,
    Eye,
    TrendingUp,
    LayoutDashboard,
    LogOut,
    User,
    Users,
    ShieldCheck,
    Phone,
    Mail,
    CheckCircle2,
    Clock,
    UserCheck,
    PlusCircle,
    ExternalLink,
    AlertCircle,
    Save,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { leadService } from "@/services/leadService";
import { teamService } from "@/services/teamService";
import { propertyService } from "@/services/propertyService";
import { toast } from "sonner";
import type { Lead, LeadStatus, Profile, Property } from "@/types";

type AdminTab = "overview" | "leads" | "supervisors" | "properties" | "settings";
type SupervisorTab = "overview" | "my_leads" | "properties" | "settings";

const STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
    new: { label: "طلب جديد", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
    contacted: { label: "تم التواصل", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
    meeting_scheduled: { label: "موعد معاينة", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    closed_won: { label: "تم التعاقد 🎉", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    closed_lost: { label: "ملغي / غير مهتم", color: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
};

export default function Dashboard() {
    const { user, role, isAdmin, isSupervisor, logout } = useAuth();
    const { favorites } = useFavorites();

    const [tab, setTab] = useState<string>("overview");
    const [leads, setLeads] = useState<Lead[]>([]);
    const [supervisors, setSupervisors] = useState<Profile[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Filter states
    const [leadFilter, setLeadFilter] = useState<"all" | "unassigned" | "assigned">("all");
    const [notesEditState, setNotesEditState] = useState<Record<string, string>>({});

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            setLoadingData(true);
            try {
                const [leadsRes, supsRes, props] = await Promise.all([
                    leadService.getLeads(),
                    isAdmin ? teamService.getSupervisors() : Promise.resolve({ success: true, data: [] }),
                    propertyService.getAll(),
                ]);

                if (isMounted) {
                    if (leadsRes.success) setLeads(leadsRes.data);
                    if (supsRes.success) setSupervisors(supsRes.data);
                    setProperties(props);
                }
            } catch (err) {
                console.error("Error loading dashboard data:", err);
            } finally {
                if (isMounted) setLoadingData(false);
            }
        }

        if (user) {
            loadData();
        }

        return () => {
            isMounted = false;
        };
    }, [user, isAdmin]);

    if (!user) return <Navigate to="/login" replace />;

    // Helper: Assign lead to supervisor (Admin Only)
    const handleAssignLead = async (leadId: string, supervisorId: string) => {
        const sup = supervisors.find((s) => s.id === supervisorId);
        const res = await leadService.assignLead(leadId, supervisorId || null, user.id);
        if (res.success) {
            setLeads((prev) =>
                prev.map((l) =>
                    l.id === leadId
                        ? {
                              ...l,
                              assigned_to: supervisorId || null,
                              assigned_supervisor: sup
                                  ? { id: sup.id, full_name: sup.full_name, email: sup.email, phone: sup.phone }
                                  : null,
                          }
                        : l
                )
            );
            toast.success(
                supervisorId ? `تم تعيين العميل بنجاح للمشرف: ${sup?.full_name}` : "تم إلغاء التعيين وإعادة العميل للمستودع العام"
            );
        } else {
            toast.error("حدث خطأ أثناء تعيين العميل: " + res.error);
        }
    };

    // Helper: Update lead status & notes
    const handleUpdateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
        const res = await leadService.updateLead(leadId, { status: newStatus });
        if (res.success) {
            setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
            toast.success("تم تحديث حالة العميل بنجاح");
        } else {
            toast.error("فشل التحديث: " + res.error);
        }
    };

    const handleSaveLeadNote = async (leadId: string) => {
        const notes = notesEditState[leadId];
        if (notes === undefined) return;
        const res = await leadService.updateLead(leadId, { internal_notes: notes });
        if (res.success) {
            setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, internal_notes: notes } : l)));
            toast.success("تم حفظ الملاحظات بنجاح");
        } else {
            toast.error("فشل حفظ الملاحظات");
        }
    };

    // Filter leads
    const filteredLeads = leads.filter((lead) => {
        if (isSupervisor) {
            // Supervisor only sees leads assigned to them (database also restricts this via RLS)
            return lead.assigned_to === user.id || !lead.assigned_to;
        }
        if (leadFilter === "unassigned") return !lead.assigned_to;
        if (leadFilter === "assigned") return !!lead.assigned_to;
        return true;
    });

    const unassignedCount = leads.filter((l) => !l.assigned_to).length;
    const closedWonCount = leads.filter((l) => l.status === "closed_won").length;

    // Navigation Tabs definition based on role
    const adminNavTabs = [
        { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
        { id: "leads", label: "مركز العملاء", icon: MessageSquare, badge: unassignedCount > 0 ? unassignedCount : undefined },
        { id: "supervisors", label: "فريق المشرفين", icon: Users },
        { id: "properties", label: "العقارات", icon: Home },
        { id: "settings", label: "الإعدادات", icon: Settings },
    ];

    const supervisorNavTabs = [
        { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
        { id: "my_leads", label: "العملاء المكلف بهم", icon: MessageSquare, badge: filteredLeads.length },
        { id: "properties", label: "العقارات", icon: Home },
        { id: "settings", label: "الإعدادات", icon: Settings },
    ];

    const currentTabs = isAdmin ? adminNavTabs : supervisorNavTabs;

    return (
        <div className="min-h-screen bg-aqar-base text-start font-sans">
            <Header />
            <div className="pt-20">
                <div className="max-w-[1440px] mx-auto px-4 lg:px-10 py-8">
                    {/* Top Welcome Bar */}
                    <div className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-aqar-cyan/10 border border-aqar-cyan/30 rounded-2xl flex items-center justify-center text-aqar-cyan">
                                {isAdmin ? <ShieldCheck size={28} /> : <User size={28} />}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-aqar-text text-2xl font-bold">{user.name}</h1>
                                    <span
                                        className={`px-3 py-0.5 text-xs font-semibold rounded-full border ${
                                            isAdmin
                                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                                : "bg-aqar-cyan/10 text-aqar-cyan border-aqar-cyan/30"
                                        }`}
                                    >
                                        {isAdmin ? "مدير المكتب" : "مشرف عقارات"}
                                    </span>
                                </div>
                                <p className="text-aqar-muted text-sm mt-1">
                                    {isAdmin
                                        ? "لوحة تحكم المكتب وإدارة وتوزيع العملاء المحتملين وصلاحيات المشرفين"
                                        : "مرحباً بك! هنا تجد فقط العملاء المعينين لك لحمايتهم من التعارض مع باقي الزملاء"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                to="/list-property"
                                className="flex items-center gap-2 px-5 py-2.5 bg-aqar-cyan hover:bg-aqar-cyan/90 text-[#121212] text-sm font-bold rounded-xl transition-all shadow-lg shadow-[#00E5FF]/10"
                            >
                                <PlusCircle size={16} /> إضافة عقار جديد
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <aside className="w-full lg:w-72 shrink-0">
                            <div className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-4 sticky top-28 space-y-1.5">
                                {currentTabs.map(({ id, label, icon: Icon, badge }) => (
                                    <button
                                        key={id}
                                        onClick={() => setTab(id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                            tab === id
                                                ? "bg-aqar-cyan/15 text-aqar-cyan border border-aqar-cyan/30 shadow-sm"
                                                : "text-aqar-muted hover:text-aqar-text hover:bg-[#2C2C2E]/60 border border-transparent"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} />
                                            <span>{label}</span>
                                        </div>
                                        {badge !== undefined && (
                                            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-aqar-cyan text-[#121212]">
                                                {badge}
                                            </span>
                                        )}
                                    </button>
                                ))}

                                <div className="pt-4 mt-4 border-t border-aqar-border">
                                    <button
                                        onClick={() => logout()}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-[#FF453A] hover:bg-[#FF453A]/10 transition-colors"
                                    >
                                        <LogOut size={16} /> تسجيل الخروج
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <main className="flex-1 min-w-0">
                            {/* OVERVIEW TAB */}
                            {tab === "overview" && (
                                <div className="space-y-8">
                                    {/* KPI Stats */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                        <div className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-5 relative overflow-hidden">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-aqar-muted text-xs font-medium">إجمالي العملاء (Leads)</span>
                                                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                                                    <MessageSquare size={18} />
                                                </div>
                                            </div>
                                            <p className="text-aqar-text text-3xl font-mono font-bold">{leads.length}</p>
                                            <p className="text-xs text-aqar-muted mt-2">
                                                {unassignedCount > 0 ? `⚠️ ${unassignedCount} طلب يحتاج تعيين` : "كل الطلبات تم تعيينها"}
                                            </p>
                                        </div>

                                        <div className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-aqar-muted text-xs font-medium">العقارات المتاحة</span>
                                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                                                    <Home size={18} />
                                                </div>
                                            </div>
                                            <p className="text-aqar-text text-3xl font-mono font-bold">{properties.length}</p>
                                            <p className="text-xs text-aqar-muted mt-2">جاهزة للعرض في الموقع</p>
                                        </div>

                                        <div className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-aqar-muted text-xs font-medium">
                                                    {isAdmin ? "المشرفين النشطين" : "العملاء المكلف بهم"}
                                                </span>
                                                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                                                    {isAdmin ? <Users size={18} /> : <UserCheck size={18} />}
                                                </div>
                                            </div>
                                            <p className="text-aqar-text text-3xl font-mono font-bold">
                                                {isAdmin ? supervisors.length : filteredLeads.length}
                                            </p>
                                            <p className="text-xs text-aqar-muted mt-2">
                                                {isAdmin ? "يعملون تحت إدارتك بدون تعارض" : "مقفولين لحسابك فقط"}
                                            </p>
                                        </div>

                                        <div className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-aqar-muted text-xs font-medium">الصفقات الناجحة</span>
                                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                                                    <CheckCircle2 size={18} />
                                                </div>
                                            </div>
                                            <p className="text-aqar-text text-3xl font-mono font-bold">{closedWonCount}</p>
                                            <p className="text-xs text-aqar-muted mt-2">تم التعاقد والإغلاق</p>
                                        </div>
                                    </div>

                                    {/* Unassigned Leads Alert for Admin */}
                                    {isAdmin && unassignedCount > 0 && (
                                        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <AlertCircle className="text-amber-400 shrink-0" size={24} />
                                                <div>
                                                    <h3 className="text-aqar-text font-bold text-base">
                                                        يوجد {unassignedCount} عميل محتمل جديد بدون مشرف!
                                                    </h3>
                                                    <p className="text-aqar-muted text-sm mt-0.5">
                                                        قم بتعيينهم لأحد المشرفين فوراً لمنع التأخير وضمان خدمة العميل بسرعة.
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setTab("leads");
                                                    setLeadFilter("unassigned");
                                                }}
                                                className="px-5 py-2 bg-amber-400 text-[#121212] font-bold text-sm rounded-xl hover:bg-amber-300 transition-colors shrink-0"
                                            >
                                                توزيع الطلبات الآن
                                            </button>
                                        </div>
                                    )}

                                    {/* Latest Leads Preview */}
                                    <div className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-aqar-text text-lg font-bold">
                                                {isAdmin ? "أحدث استفسارات العملاء" : "أحدث عملائك المكلف بهم"}
                                            </h2>
                                            <button
                                                onClick={() => setTab(isAdmin ? "leads" : "my_leads")}
                                                className="text-xs text-aqar-cyan hover:underline"
                                            >
                                                عرض الكل
                                            </button>
                                        </div>

                                        {filteredLeads.slice(0, 4).length > 0 ? (
                                            <div className="space-y-3">
                                                {filteredLeads.slice(0, 4).map((lead) => (
                                                    <div
                                                        key={lead.id}
                                                        className="bg-aqar-base border border-aqar-border rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h4 className="text-aqar-text font-bold text-sm">{lead.client_name}</h4>
                                                                <span
                                                                    className={`px-2 py-0.5 text-xs rounded-full border ${
                                                                        STATUS_LABELS[lead.status]?.color ||
                                                                        "bg-gray-500/10 text-gray-400"
                                                                    }`}
                                                                >
                                                                    {STATUS_LABELS[lead.status]?.label || lead.status}
                                                                </span>
                                                            </div>
                                                            <p className="text-aqar-muted text-xs">
                                                                📞 {lead.client_phone} | {lead.property_title || "طلب عام"}
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            {lead.assigned_supervisor ? (
                                                                <span className="text-xs text-aqar-muted bg-[#2C2C2E] px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                                    <UserCheck size={14} className="text-aqar-cyan" />
                                                                    {lead.assigned_supervisor.full_name}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg">
                                                                    غير معين
                                                                </span>
                                                            )}
                                                            <a
                                                                href={`https://wa.me/${lead.client_phone.replace(/\D/g, "")}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-lg transition-colors"
                                                            >
                                                                واتساب
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-aqar-muted py-8 text-sm">لا توجد طلبات عملاء حتى الآن</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* LEADS TAB (ADMIN OR SUPERVISOR) */}
                            {(tab === "leads" || tab === "my_leads") && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-aqar-text text-xl font-bold">
                                                {isAdmin ? "مركز إدارة وتوزيع العملاء" : "العملاء المكلف بهم"}
                                            </h2>
                                            <p className="text-aqar-muted text-xs mt-1">
                                                {isAdmin
                                                    ? "تحكم في توزيع العملاء على المشرفين لمنع تداخل أو تعارض العمل على نفس الـ Lead"
                                                    : "هذه القائمة خاصة بك وحدك ومقفولة في النظام حتى لا يتواصل زميل آخر مع نفس العميل"}
                                            </p>
                                        </div>

                                        {isAdmin && (
                                            <div className="flex items-center gap-2 bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none p-1 rounded-xl">
                                                <button
                                                    onClick={() => setLeadFilter("all")}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                        leadFilter === "all" ? "bg-aqar-cyan text-[#121212]" : "text-aqar-muted"
                                                    }`}
                                                >
                                                    الكل ({leads.length})
                                                </button>
                                                <button
                                                    onClick={() => setLeadFilter("unassigned")}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                        leadFilter === "unassigned" ? "bg-amber-400 text-[#121212]" : "text-aqar-muted"
                                                    }`}
                                                >
                                                    غير معين ({unassignedCount})
                                                </button>
                                                <button
                                                    onClick={() => setLeadFilter("assigned")}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                        leadFilter === "assigned" ? "bg-aqar-cyan text-[#121212]" : "text-aqar-muted"
                                                    }`}
                                                >
                                                    معين ({leads.length - unassignedCount})
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {filteredLeads.length > 0 ? (
                                        <div className="space-y-4">
                                            {filteredLeads.map((lead) => {
                                                const currentNotes =
                                                    notesEditState[lead.id] !== undefined
                                                        ? notesEditState[lead.id]
                                                        : lead.internal_notes || "";

                                                return (
                                                    <div
                                                        key={lead.id}
                                                        className={`bg-[#1C1C1E] border rounded-2xl p-6 transition-all ${
                                                            !lead.assigned_to
                                                                ? "border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-transparent"
                                                                : "border-aqar-border"
                                                        }`}
                                                    >
                                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-aqar-border">
                                                            <div>
                                                                <div className="flex items-center gap-3 flex-wrap">
                                                                    <h3 className="text-aqar-text font-bold text-base">{lead.client_name}</h3>
                                                                    <span
                                                                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                                                                            STATUS_LABELS[lead.status]?.color ||
                                                                            "bg-gray-500/10 text-gray-400"
                                                                        }`}
                                                                    >
                                                                        {STATUS_LABELS[lead.status]?.label || lead.status}
                                                                    </span>
                                                                    {lead.property_title && (
                                                                        <span className="text-xs bg-[#2C2C2E] text-aqar-muted px-2.5 py-0.5 rounded-full">
                                                                            {lead.property_title}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-aqar-muted mt-1.5 flex items-center gap-4">
                                                                    <span>تاريخ الطلب: {new Date(lead.created_at).toLocaleDateString("ar-EG")}</span>
                                                                    <span>المصدر: {lead.source || "الموقع الإلكتروني"}</span>
                                                                </p>
                                                            </div>

                                                            {/* Quick Contact buttons */}
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <a
                                                                    href={`tel:${lead.client_phone}`}
                                                                    className="flex items-center gap-1.5 px-3 py-2 bg-[#2C2C2E] hover:bg-[#3C3C3E] text-aqar-text text-xs font-medium rounded-xl transition-colors"
                                                                >
                                                                    <Phone size={14} className="text-aqar-cyan" /> {lead.client_phone}
                                                                </a>
                                                                <a
                                                                    href={`https://wa.me/${lead.client_phone.replace(/\D/g, "")}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl transition-colors"
                                                                >
                                                                    واتساب
                                                                </a>
                                                            </div>
                                                        </div>

                                                        {/* Client Message */}
                                                        {lead.message && (
                                                            <div className="mt-4 p-3.5 bg-aqar-base rounded-xl border border-aqar-border">
                                                                <p className="text-xs text-aqar-muted mb-1">رسالة العميل:</p>
                                                                <p className="text-aqar-text text-sm">{lead.message}</p>
                                                            </div>
                                                        )}

                                                        {/* Workflow Controls: Assignment & Status */}
                                                        <div className="mt-5 pt-4 border-t border-aqar-border grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {/* Assignment (Admin only) or Readonly for Supervisor */}
                                                            <div>
                                                                <label className="text-xs text-aqar-muted font-medium block mb-1.5">
                                                                    المشرف المكلف بمتابعة هذا العميل:
                                                                </label>
                                                                {isAdmin ? (
                                                                    <select
                                                                        value={lead.assigned_to || ""}
                                                                        onChange={(e) => handleAssignLead(lead.id, e.target.value)}
                                                                        className="w-full px-3.5 py-2.5 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                                                    >
                                                                        <option value="">-- غير معين (متاح للجميع أو معلق) --</option>
                                                                        {supervisors.map((sup) => (
                                                                            <option key={sup.id} value={sup.id}>
                                                                                {sup.full_name} ({sup.email})
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                ) : (
                                                                    <div className="px-3.5 py-2.5 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-cyan flex items-center gap-2">
                                                                        <UserCheck size={16} /> مكلف لك وحدك
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Status Selector */}
                                                            <div>
                                                                <label className="text-xs text-aqar-muted font-medium block mb-1.5">
                                                                    حالة المتابعة:
                                                                </label>
                                                                <select
                                                                    value={lead.status}
                                                                    onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                                                                    className="w-full px-3.5 py-2.5 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                                                >
                                                                    <option value="new">طلب جديد</option>
                                                                    <option value="contacted">تم التواصل هاتفياً</option>
                                                                    <option value="meeting_scheduled">تم تحديد موعد معاينة</option>
                                                                    <option value="closed_won">تم التعاقد والبيع بنجاح 🎉</option>
                                                                    <option value="closed_lost">ملغي / غير مهتم</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Notes & Follow-up log */}
                                                        <div className="mt-4">
                                                            <div className="flex items-center justify-between mb-1.5">
                                                                <label className="text-xs text-aqar-muted">ملاحظات المتابعة الداخلية:</label>
                                                                {notesEditState[lead.id] !== undefined &&
                                                                    notesEditState[lead.id] !== lead.internal_notes && (
                                                                        <button
                                                                            onClick={() => handleSaveLeadNote(lead.id)}
                                                                            className="flex items-center gap-1 text-xs text-aqar-cyan hover:underline"
                                                                        >
                                                                            <Save size={12} /> حفظ الملاحظة
                                                                        </button>
                                                                    )}
                                                            </div>
                                                            <input
                                                                value={currentNotes}
                                                                onChange={(e) =>
                                                                    setNotesEditState((prev) => ({ ...prev, [lead.id]: e.target.value }))
                                                                }
                                                                onBlur={() => handleSaveLeadNote(lead.id)}
                                                                placeholder="اكتب تفاصيل المكالمة أو موعد المعاينة واضغط Enter للحفظ..."
                                                                className="w-full px-3.5 py-2 bg-aqar-base border border-aqar-border rounded-xl text-xs text-aqar-text placeholder:text-aqar-muted/60 focus:border-aqar-cyan/50 focus:outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-12 text-center">
                                            <MessageSquare size={36} className="text-aqar-muted mx-auto mb-3" />
                                            <h3 className="text-aqar-text font-bold text-base mb-1">لا توجد طلبات مطابقة</h3>
                                            <p className="text-xs text-aqar-muted">
                                                {isAdmin ? "لم يتم استلام طلبات في هذا القسم حالياً" : "لم يتم تعيين عملاء لك حتى الآن"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SUPERVISORS MANAGEMENT TAB (ADMIN ONLY) */}
                            {tab === "supervisors" && isAdmin && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-aqar-text text-xl font-bold">فريق المشرفين والوكلاء</h2>
                                            <p className="text-aqar-muted text-xs mt-1">
                                                إدارة حسابات المشرفين، تفعيلهم، وتخصيص صلاحياتهم في نشر العقارات واستلام الـ Leads
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {supervisors.map((sup) => {
                                            const supLeads = leads.filter((l) => l.assigned_to === sup.id);
                                            const wonCount = supLeads.filter((l) => l.status === "closed_won").length;

                                            return (
                                                <div key={sup.id} className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-6">
                                                    <div className="flex items-start justify-between gap-4 mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-xl bg-aqar-cyan/10 border border-aqar-cyan/30 flex items-center justify-center text-aqar-cyan font-bold">
                                                                {sup.full_name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-aqar-text font-bold text-base">{sup.full_name}</h3>
                                                                <p className="text-xs text-aqar-muted">{sup.email}</p>
                                                                {sup.phone && <p className="text-xs text-aqar-muted mt-0.5">📞 {sup.phone}</p>}
                                                            </div>
                                                        </div>
                                                        <span
                                                            className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                                                                sup.is_active
                                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                                                    : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                                            }`}
                                                        >
                                                            {sup.is_active ? "نشط" : "معطل"}
                                                        </span>
                                                    </div>

                                                    {/* Supervisor performance snapshot */}
                                                    <div className="grid grid-cols-2 gap-2 p-3 bg-aqar-base rounded-xl border border-aqar-border mb-4 text-center">
                                                        <div>
                                                            <p className="text-xs text-aqar-muted">الـ Leads المكلف بها</p>
                                                            <p className="text-aqar-text font-mono font-bold text-base mt-1">
                                                                {supLeads.length}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-aqar-muted">الصفقات المكتملة</p>
                                                            <p className="text-emerald-400 font-mono font-bold text-base mt-1">
                                                                {wonCount}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Permissions list */}
                                                    <div className="space-y-1.5 text-xs text-aqar-muted pt-3 border-t border-aqar-border">
                                                        <div className="flex items-center justify-between">
                                                            <span>نشر وإضافة عقارات جديدة:</span>
                                                            <span className="text-aqar-text font-semibold">مسموح</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span>الاطلاع على عملاء الزملاء:</span>
                                                            <span className="text-rose-400 font-semibold">محظور (منع التعارض)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* PROPERTIES TAB */}
                            {tab === "properties" && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-aqar-text text-xl font-bold">إدارة العقارات</h2>
                                            <p className="text-aqar-muted text-xs mt-1">
                                                {isAdmin ? "قائمة بجميع العقارات المنشورة في الموقع" : "العقارات المتاحة والمعروضة"}
                                            </p>
                                        </div>
                                        <Link
                                            to="/list-property"
                                            className="px-4 py-2 bg-aqar-cyan hover:bg-aqar-cyan/90 text-[#121212] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                                        >
                                            <PlusCircle size={14} /> إضافة عقار جديد
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {properties.map((p) => (
                                            <PropertyCard key={p.id} property={p} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SETTINGS TAB */}
                            {tab === "settings" && (
                                <div className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-6 max-w-xl">
                                    <h2 className="text-aqar-text font-bold text-lg mb-4">إعدادات الحساب</h2>
                                    <div className="space-y-4 text-xs">
                                        <div>
                                            <label className="text-aqar-muted block mb-1">الاسم الكامل:</label>
                                            <input
                                                defaultValue={user.name}
                                                className="w-full px-4 py-2.5 bg-aqar-base border border-aqar-border rounded-xl text-aqar-text text-sm focus:border-aqar-cyan/50 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-aqar-muted block mb-1">البريد الإلكتروني:</label>
                                            <input
                                                defaultValue={user.email}
                                                disabled
                                                className="w-full px-4 py-2.5 bg-aqar-base/60 border border-aqar-border rounded-xl text-aqar-muted text-sm cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-aqar-muted block mb-1">الدور الحالي:</label>
                                            <input
                                                defaultValue={isAdmin ? "أدمن (مدير المكتب)" : "مشرف عقارات (Supervisor)"}
                                                disabled
                                                className="w-full px-4 py-2.5 bg-aqar-base/60 border border-aqar-border rounded-xl text-cyan-400 font-semibold text-sm cursor-not-allowed"
                                            />
                                        </div>
                                        <button
                                            onClick={() => toast.success("تم حفظ البيانات بنجاح")}
                                            className="px-6 py-2.5 bg-aqar-cyan hover:bg-aqar-cyan/90 text-[#121212] font-bold rounded-xl transition-colors mt-2"
                                        >
                                            حفظ التعديلات
                                        </button>
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
