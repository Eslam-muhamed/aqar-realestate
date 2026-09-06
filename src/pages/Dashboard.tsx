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
    Archive,
    RotateCcw,
    Download,
    BarChart3,
    HardDrive,
    RefreshCw,
    PieChart,
    Sparkles,
    UserPlus,
    Trash2,
    X,
    Loader2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { leadService } from "@/services/leadService";
import { teamService } from "@/services/teamService";
import { propertyService } from "@/services/propertyService";
import { analyticsService } from "@/services/analyticsService";
import { cacheManager } from "@/lib/cacheManager";
import { toast } from "sonner";
import type { Lead, LeadStatus, Profile, Property } from "@/types";

type AdminTab = "overview" | "leads" | "analytics" | "supervisors" | "properties" | "settings";
type SupervisorTab = "overview" | "my_leads" | "analytics" | "properties" | "settings";

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
    const [archivedLeads, setArchivedLeads] = useState<Lead[]>([]);
    const [supervisors, setSupervisors] = useState<Profile[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [archivedProperties, setArchivedProperties] = useState<Property[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Filter states
    const [leadFilter, setLeadFilter] = useState<"all" | "unassigned" | "assigned" | "archived">("all");
    const [propertyFilter, setPropertyFilter] = useState<"active" | "archived">("active");
    const [notesEditState, setNotesEditState] = useState<Record<string, string>>({});
    const [storageUsage, setStorageUsage] = useState(() => cacheManager.getStorageUsage());

    const [page, setPage] = useState(1);
    const limit = 50;

    const [assigningLeadId, setAssigningLeadId] = useState<string | null>(null);
    const [updatingStatusLeadId, setUpdatingStatusLeadId] = useState<string | null>(null);
    const [savingNoteLeadId, setSavingNoteLeadId] = useState<string | null>(null);
    const [isAddSupervisorOpen, setIsAddSupervisorOpen] = useState(false);
    const [addingSupervisor, setAddingSupervisor] = useState(false);
    const [deletingSupervisorId, setDeletingSupervisorId] = useState<string | null>(null);
    const [newSupervisorForm, setNewSupervisorForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        permissions: {
            can_add_properties: true,
            can_edit_all_properties: false,
            can_delete_properties: false,
            can_claim_unassigned_leads: true,
        },
    });

    useEffect(() => {
        let isMounted = true;

        async function fetchDashboardData() {
            setLoadingData(true);
            try {
                const [leadsRes, supsRes, propsRes, archLeadsRes, archPropsRes] = await Promise.all([
                    leadService.getLeads(page, limit),
                    isAdmin ? teamService.getSupervisors(page, limit) : Promise.resolve({ success: true, data: [] }),
                    propertyService.getAll(page, limit),
                    leadService.getArchivedLeads(1, 100),
                    propertyService.getArchived(1, 100),
                ]);

                if (isMounted) {
                    if (leadsRes.success) setLeads(leadsRes.data);
                    if (supsRes.success) setSupervisors(supsRes.data);
                    setProperties(propsRes.data || []);
                    if (archLeadsRes.success) setArchivedLeads(archLeadsRes.data);
                    setArchivedProperties(archPropsRes.data || []);
                }
            } catch (err) {
                console.error("Error loading dashboard data:", err);
            } finally {
                if (isMounted) setLoadingData(false);
            }
        }

        if (user) {
            fetchDashboardData();
        }

        return () => {
            isMounted = false;
        };
    }, [isAdmin, user.id, page]);

    if (!user) return <Navigate to="/login" replace />;

    // Helper: Assign lead to supervisor (Admin Only)
    const handleAssignLead = async (leadId: string, supervisorId: string) => {
        setAssigningLeadId(leadId);
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
        setAssigningLeadId(null);
    };

    // Helper: Update lead status & notes
    const handleUpdateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
        setUpdatingStatusLeadId(leadId);
        const res = await leadService.updateLead(leadId, { status: newStatus });
        if (res.success) {
            setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
            toast.success("تم تحديث حالة العميل بنجاح");
        } else {
            toast.error("فشل التحديث: " + res.error);
        }
        setUpdatingStatusLeadId(null);
    };

    const handleSaveLeadNote = async (leadId: string) => {
        const notes = notesEditState[leadId];
        if (notes === undefined) return;
        setSavingNoteLeadId(leadId);
        const res = await leadService.updateLead(leadId, { internal_notes: notes });
        if (res.success) {
            setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, internal_notes: notes } : l)));
            toast.success("تم حفظ الملاحظات بنجاح");
        } else {
            toast.error("فشل حفظ الملاحظات");
        }
        setSavingNoteLeadId(null);
    };

    const handleDeleteProperty = async (id: string) => {
        if (!confirm("هل أنت متأكد من حذف هذا العقار نهائياً؟")) return;
        
        try {
            const res = await propertyService.deleteProperty(id);
            if (res.success) {
                toast.success("تم حذف العقار بنجاح");
                setProperties(prev => prev.filter(p => p.id !== id));
                setArchivedProperties(prev => prev.filter(p => p.id !== id));
            } else {
                toast.error("فشل حذف العقار: " + res.error);
            }
        } catch (error) {
            toast.error("حدث خطأ أثناء الحذف");
        }
    };

    const handleArchiveLead = async (leadId: string) => {
        const target = leads.find((l) => l.id === leadId);
        if (!target) return;
        const res = await leadService.archiveLead(leadId);
        if (res.success) {
            setLeads((prev) => prev.filter((l) => l.id !== leadId));
            setArchivedLeads((prev) => [{ ...target, is_archived: true }, ...prev]);
            toast.success("تم نقل العميل إلى الأرشيف بنجاح");
        } else {
            toast.error("فشل أرشفة العميل: " + res.error);
        }
    };

    const handleRestoreLead = async (leadId: string) => {
        const target = archivedLeads.find((l) => l.id === leadId);
        if (!target) return;
        const res = await leadService.restoreLead(leadId);
        if (res.success) {
            setArchivedLeads((prev) => prev.filter((l) => l.id !== leadId));
            setLeads((prev) => [{ ...target, is_archived: false }, ...prev]);
            toast.success("تمت استعادة العميل إلى قائمة المتابعة النشطة");
        } else {
            toast.error("فشل استعادة العميل: " + res.error);
        }
    };

    const handleArchiveProperty = async (id: string) => {
        const target = properties.find((p) => p.id === id);
        if (!target) return;
        const res = await propertyService.archiveProperty(id);
        if (res.success) {
            setProperties((prev) => prev.filter((p) => p.id !== id));
            setArchivedProperties((prev) => [{ ...target, is_archived: true }, ...prev]);
            toast.success("تم نقل العقار إلى الأرشيف وإخفاؤه من العرض النشط");
        } else {
            toast.error("فشل أرشفة العقار: " + res.error);
        }
    };

    const handleRestoreProperty = async (id: string) => {
        const target = archivedProperties.find((p) => p.id === id);
        if (!target) return;
        const res = await propertyService.restoreProperty(id);
        if (res.success) {
            setArchivedProperties((prev) => prev.filter((p) => p.id !== id));
            setProperties((prev) => [{ ...target, is_archived: false }, ...prev]);
            toast.success("تمت استعادة العقار ونشره مجدداً في الموقع");
        } else {
            toast.error("فشل استعادة العقار: " + res.error);
        }
    };

    const handleCreateSupervisor = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSupervisorForm.full_name || !newSupervisorForm.email || !newSupervisorForm.password) {
            toast.error("يرجى ملء جميع الحقول المطلوبة (الاسم، البريد، كلمة المرور)");
            return;
        }
        if (newSupervisorForm.password.length < 6) {
            toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
            return;
        }

        setAddingSupervisor(true);
        const res = await teamService.createSupervisor(newSupervisorForm);
        setAddingSupervisor(false);

        if (res.success) {
            toast.success("تم إنشاء حساب المشرف بنجاح ويمكنه تسجيل الدخول فوراً!");
            setIsAddSupervisorOpen(false);
            setNewSupervisorForm({
                full_name: "",
                email: "",
                phone: "",
                password: "",
                permissions: {
                    can_add_properties: true,
                    can_edit_all_properties: false,
                    can_delete_properties: false,
                    can_claim_unassigned_leads: true,
                },
            });
            const refresh = await teamService.getSupervisors(1, limit);
            if (refresh.success) setSupervisors(refresh.data);
        } else {
            toast.error("فشل إنشاء المشرف: " + res.error);
        }
    };

    const handleDeleteSupervisor = async (supId: string, supName: string) => {
        if (!confirm(`هل أنت متأكد من حذف حساب المشرف "${supName}" نهائياً؟ سيتم إلغاء تعيين أي عملاء مكلف بهم.`)) {
            return;
        }

        setDeletingSupervisorId(supId);
        const res = await teamService.deleteSupervisor(supId);
        setDeletingSupervisorId(null);

        if (res.success) {
            toast.success("تم حذف حساب المشرف بنجاح");
            setSupervisors((prev) => prev.filter((s) => s.id !== supId));
            setLeads((prev) =>
                prev.map((l) => (l.assigned_to === supId ? { ...l, assigned_to: null, assigned_supervisor: undefined } : l))
            );
        } else {
            toast.error("فشل حذف المشرف: " + res.error);
        }
    };

    const handleToggleSupervisorStatus = async (supId: string, currentStatus: boolean) => {
        const res = await teamService.toggleStatus(supId, !currentStatus);
        if (res.success) {
            setSupervisors((prev) =>
                prev.map((s) => (s.id === supId ? { ...s, is_active: !currentStatus } : s))
            );
            toast.success(!currentStatus ? "تم تفعيل حساب المشرف" : "تم تعطيل حساب المشرف مؤقتاً");
        } else {
            toast.error("فشل تعديل حالة المشرف: " + res.error);
        }
    };

    // Filter leads (supporting Active vs Archived)
    const leadsSource = leadFilter === "archived" ? archivedLeads : leads;
    const filteredLeads = leadsSource.filter((lead) => {
        if (isSupervisor) {
            // Supervisor only sees leads assigned to them
            return lead.assigned_to === user.id || !lead.assigned_to;
        }
        if (leadFilter === "unassigned") return !lead.assigned_to;
        if (leadFilter === "assigned") return !!lead.assigned_to;
        return true;
    });

    const unassignedCount = leads.filter((l) => !l.assigned_to).length;
    const closedWonCount = leads.filter((l) => l.status === "closed_won").length;

    // Analytics Metrics
    const analyticsMetrics = analyticsService.computeMetrics(
        leads,
        properties,
        supervisors,
        archivedLeads.length,
        archivedProperties.length
    );

    // Navigation Tabs definition based on role
    const adminNavTabs = [
        { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
        { id: "leads", label: "مركز العملاء", icon: MessageSquare, badge: unassignedCount > 0 ? unassignedCount : undefined },
        { id: "analytics", label: "التقارير والإحصائيات", icon: TrendingUp },
        { id: "supervisors", label: "فريق المشرفين", icon: Users },
        { id: "properties", label: "العقارات", icon: Home },
        { id: "settings", label: "الإعدادات", icon: Settings },
    ];

    const supervisorNavTabs = [
        { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
        { id: "my_leads", label: "العملاء المكلف بهم", icon: MessageSquare, badge: filteredLeads.length },
        { id: "analytics", label: "التقارير والإحصائيات", icon: TrendingUp },
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
                                className="flex items-center gap-2 px-5 py-2.5 bg-aqar-cyan hover:bg-aqar-cyan/90 text-aqar-btnText text-sm font-bold rounded-xl transition-all shadow-lg shadow-aqar-cyan/10"
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
                                                : "text-aqar-muted hover:text-aqar-text hover:bg-aqar-hover border border-transparent"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} />
                                            <span>{label}</span>
                                        </div>
                                        {badge !== undefined && (
                                            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-aqar-cyan text-aqar-btnText">
                                                {badge}
                                            </span>
                                        )}
                                    </button>
                                ))}

                                <div className="pt-4 mt-4 border-t border-aqar-border">
                                    <button
                                        onClick={() => logout()}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-aqar-danger hover:bg-aqar-danger/10 transition-colors"
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
                                                className="px-5 py-2 bg-amber-500 text-white font-bold text-sm rounded-xl hover:bg-amber-400 transition-colors shrink-0"
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
                                                                <span className="text-xs text-aqar-muted bg-aqar-hover px-3 py-1.5 rounded-lg flex items-center gap-1.5">
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
                                                        leadFilter === "all" ? "bg-aqar-cyan text-aqar-btnText" : "text-aqar-muted"
                                                    }`}
                                                >
                                                    الكل ({leads.length})
                                                </button>
                                                <button
                                                    onClick={() => setLeadFilter("unassigned")}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                        leadFilter === "unassigned" ? "bg-amber-500 text-white" : "text-aqar-muted"
                                                    }`}
                                                >
                                                    غير معين ({unassignedCount})
                                                </button>
                                                <button
                                                    onClick={() => setLeadFilter("assigned")}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                        leadFilter === "assigned" ? "bg-aqar-cyan text-aqar-btnText" : "text-aqar-muted"
                                                    }`}
                                                >
                                                    معين ({leads.length - unassignedCount})
                                                </button>
                                                <button
                                                    onClick={() => setLeadFilter("archived")}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                                                        leadFilter === "archived" ? "bg-amber-500 text-white" : "text-aqar-muted hover:text-aqar-text"
                                                    }`}
                                                >
                                                    <Archive size={12} /> المؤرشفة ({archivedLeads.length})
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="flex items-center justify-between mt-4">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-4 py-2 bg-aqar-base border border-aqar-border rounded-xl text-xs disabled:opacity-50"
                                        >
                                            السابق
                                        </button>
                                        <span className="text-xs text-aqar-muted">الصفحة {page}</span>
                                        <button
                                            onClick={() => setPage((p) => p + 1)}
                                            disabled={leads.length < limit}
                                            className="px-4 py-2 bg-aqar-base border border-aqar-border rounded-xl text-xs disabled:opacity-50"
                                        >
                                            التالي
                                        </button>
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
                                                            lead.is_archived
                                                                ? "border-amber-500/20 bg-amber-500/5 opacity-80"
                                                                : !lead.assigned_to
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
                                                                    {lead.is_archived && (
                                                                        <span className="text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                                                                            <Archive size={11} /> مؤرشف
                                                                        </span>
                                                                    )}
                                                                    {lead.property_title && (
                                                                        <span className="text-xs bg-aqar-hover text-aqar-muted px-2.5 py-0.5 rounded-full">
                                                                            {lead.property_title}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-aqar-muted mt-1.5 flex items-center gap-4">
                                                                    <span>تاريخ الطلب: {new Date(lead.created_at).toLocaleDateString("ar-EG")}</span>
                                                                    <span>المصدر: {lead.source || "الموقع الإلكتروني"}</span>
                                                                </p>
                                                            </div>

                                                            {/* Quick Contact & Archiving buttons */}
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <a
                                                                    href={`tel:${lead.client_phone}`}
                                                                    className="flex items-center gap-1.5 px-3 py-2 bg-aqar-hover hover:bg-aqar-active text-aqar-text text-xs font-medium rounded-xl transition-colors"
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

                                                                {lead.is_archived ? (
                                                                    <button
                                                                        onClick={() => handleRestoreLead(lead.id)}
                                                                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-colors"
                                                                        title="استعادة العميل إلى قائمة المتابعة النشطة"
                                                                    >
                                                                        <RotateCcw size={13} /> استعادة
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => handleArchiveLead(lead.id)}
                                                                        className="flex items-center gap-1.5 px-3 py-2 bg-aqar-hover hover:bg-amber-500/15 text-aqar-muted hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500/30 border border-transparent text-xs font-medium rounded-xl transition-colors"
                                                                        title="أرشفة هذا العميل"
                                                                    >
                                                                        <Archive size={13} /> أرشفة
                                                                    </button>
                                                                )}
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
                                                                        disabled={assigningLeadId === lead.id}
                                                                        onChange={(e) => handleAssignLead(lead.id, e.target.value)}
                                                                        className="w-full px-3.5 py-2.5 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none disabled:opacity-50"
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
                                                                    disabled={updatingStatusLeadId === lead.id}
                                                                    onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                                                                    className="w-full px-3.5 py-2.5 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none disabled:opacity-50"
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
                                                                            disabled={savingNoteLeadId === lead.id}
                                                                            className="flex items-center gap-1 text-xs text-aqar-cyan hover:underline disabled:opacity-50"
                                                                        >
                                                                            <Save size={12} /> {savingNoteLeadId === lead.id ? "جاري الحفظ..." : "حفظ الملاحظة"}
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

                            {/* ANALYTICS & REPORTS TAB */}
                            {tab === "analytics" && (
                                <div className="space-y-8">
                                    {/* Header & Export Actions */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-aqar-surface border border-aqar-border rounded-2xl p-6">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="text-aqar-cyan" size={24} />
                                                <h2 className="text-aqar-text text-xl font-bold">التقارير ومؤشرات الأداء</h2>
                                            </div>
                                            <p className="text-aqar-muted text-xs mt-1">
                                                تحليلات فورية لسرعة تحويل الـ Leads، ومصادر العملاء، وتوزيع المعروض العقاري
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <button
                                                onClick={() => {
                                                    analyticsService.exportLeadsToCSV(leadsSource, "aqar_leads_export.csv");
                                                    toast.success("تم تنزيل تقرير العملاء بصيغة CSV بنجاح!");
                                                }}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-aqar-hover hover:bg-aqar-active text-aqar-text border border-aqar-border text-xs font-bold rounded-xl transition-all shadow-sm"
                                            >
                                                <Download size={14} className="text-aqar-cyan" /> تصدير قائمة العملاء (CSV)
                                            </button>

                                            <button
                                                onClick={() => {
                                                    analyticsService.exportExecutiveSummaryToCSV(analyticsMetrics, "aqar_kpi_summary.csv");
                                                    toast.success("تم تنزيل ملخص المؤشرات التنفيذية (KPI) بنجاح!");
                                                }}
                                                className="flex items-center gap-2 px-4 py-2.5 bg-aqar-cyan hover:bg-aqar-cyan/90 text-aqar-btnText text-xs font-bold rounded-xl transition-all shadow-lg shadow-aqar-cyan/15"
                                            >
                                                <Download size={14} /> تصدير ملخص الأداء (KPI)
                                            </button>
                                        </div>
                                    </div>

                                    {/* Top 4 KPI Metrics */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                        <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-5 relative overflow-hidden">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-aqar-muted text-xs font-medium">معدل تحويل الصفقات</span>
                                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                                                    <Sparkles size={18} />
                                                </div>
                                            </div>
                                            <p className="text-aqar-text text-3xl font-mono font-bold">{analyticsMetrics.conversionRate}%</p>
                                            <p className="text-xs text-aqar-muted mt-2">
                                                {analyticsMetrics.closedWonCount} صفقة ناجحة من {analyticsMetrics.closedWonCount + analyticsMetrics.closedLostCount} منتهية
                                            </p>
                                        </div>

                                        <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-aqar-muted text-xs font-medium">إجمالي العملاء والطلبات</span>
                                                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                                                    <MessageSquare size={18} />
                                                </div>
                                            </div>
                                            <p className="text-aqar-text text-3xl font-mono font-bold">{analyticsMetrics.totalLeads}</p>
                                            <p className="text-xs text-aqar-muted mt-2">
                                                {analyticsMetrics.activeLeads} عميل نشط | {analyticsMetrics.archivedLeads} بالأرشيف
                                            </p>
                                        </div>

                                        <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-aqar-muted text-xs font-medium">متوسط سعر البيع</span>
                                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                                                    <BarChart3 size={18} />
                                                </div>
                                            </div>
                                            <p className="text-aqar-text text-2xl font-mono font-bold">
                                                {analyticsMetrics.avgSalePrice.toLocaleString()} <span className="text-xs text-aqar-muted font-sans">ر.س</span>
                                            </p>
                                            <p className="text-xs text-aqar-muted mt-2">
                                                من إجمالي {analyticsMetrics.forSaleCount} عقار للبيع
                                            </p>
                                        </div>

                                        <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-aqar-muted text-xs font-medium">مخزون العقارات والأرشيف</span>
                                                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                                                    <Archive size={18} />
                                                </div>
                                            </div>
                                            <p className="text-aqar-text text-3xl font-mono font-bold">{analyticsMetrics.totalProperties}</p>
                                            <p className="text-xs text-aqar-muted mt-2">
                                                {analyticsMetrics.activeProperties} نشط بالموقع | {analyticsMetrics.archivedProperties} بالأرشيف
                                            </p>
                                        </div>
                                    </div>

                                    {/* Breakdown Sections: Sources & Property Types */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Lead Sources Breakdown */}
                                        <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-aqar-text font-bold text-base flex items-center gap-2">
                                                    <PieChart size={18} className="text-aqar-cyan" /> مصادر استقطاب العملاء
                                                </h3>
                                                <span className="text-xs text-aqar-muted">{leads.length} طلب نشط</span>
                                            </div>

                                            <div className="space-y-3 pt-2">
                                                {Object.entries(analyticsMetrics.leadsBySource).length > 0 ? (
                                                    Object.entries(analyticsMetrics.leadsBySource).map(([source, count]) => {
                                                        const pct = Math.round((count / (leads.length || 1)) * 100);
                                                        return (
                                                            <div key={source} className="space-y-1.5">
                                                                <div className="flex items-center justify-between text-xs">
                                                                    <span className="text-aqar-text font-medium">{source}</span>
                                                                    <span className="text-aqar-muted font-mono">{count} ({pct}%)</span>
                                                                </div>
                                                                <div className="w-full h-2 bg-aqar-base rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-aqar-cyan rounded-full transition-all duration-500"
                                                                        style={{ width: `${Math.max(5, pct)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-xs text-aqar-muted text-center py-6">لا توجد بيانات كافية لمصادر العملاء</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Property Types Breakdown */}
                                        <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-aqar-text font-bold text-base flex items-center gap-2">
                                                    <Home size={18} className="text-blue-400" /> تصنيف المعروض العقاري
                                                </h3>
                                                <span className="text-xs text-aqar-muted">{properties.length} عقار</span>
                                            </div>

                                            <div className="space-y-3 pt-2">
                                                {Object.entries(analyticsMetrics.propertiesByType).length > 0 ? (
                                                    Object.entries(analyticsMetrics.propertiesByType).map(([type, count]) => {
                                                        const pct = Math.round((count / (properties.length || 1)) * 100);
                                                        const typeNames: Record<string, string> = {
                                                            villa: "فيلا",
                                                            apartment: "شقة",
                                                            penthouse: "بنتهاوس",
                                                            townhouse: "تاون هاوس",
                                                            duplex: "دوبلكس",
                                                            commercial: "تجاري",
                                                        };
                                                        return (
                                                            <div key={type} className="space-y-1.5">
                                                                <div className="flex items-center justify-between text-xs">
                                                                    <span className="text-aqar-text font-medium">{typeNames[type] || type}</span>
                                                                    <span className="text-aqar-muted font-mono">{count} ({pct}%)</span>
                                                                </div>
                                                                <div className="w-full h-2 bg-aqar-base rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-blue-400 rounded-full transition-all duration-500"
                                                                        style={{ width: `${Math.max(5, pct)}%` }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-xs text-aqar-muted text-center py-6">لا توجد عقارات مضافة بعد</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Supervisors Performance Leaderboard (Admin view) */}
                                    {isAdmin && (
                                        <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-aqar-text font-bold text-base flex items-center gap-2">
                                                        <Users size={18} className="text-amber-400" /> ترتيب كفاءة المشرفين ومعدل إغلاق الصفقات
                                                    </h3>
                                                    <p className="text-xs text-aqar-muted mt-0.5">
                                                        ترتيب المشرفين حسب عدد الصفقات الناجحة ونسبة التحويل
                                                    </p>
                                                </div>
                                            </div>

                                            {analyticsMetrics.supervisorPerformance.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-start text-xs">
                                                        <thead>
                                                            <tr className="border-b border-aqar-border text-aqar-muted">
                                                                <th className="pb-3 text-start font-medium">المشرف</th>
                                                                <th className="pb-3 text-center font-medium">العملاء المكلف بهم</th>
                                                                <th className="pb-3 text-center font-medium">الصفقات المكتملة</th>
                                                                <th className="pb-3 text-center font-medium">الصفقات الملغاة</th>
                                                                <th className="pb-3 text-end font-medium">نسبة النجاح</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-aqar-border/50">
                                                            {analyticsMetrics.supervisorPerformance.map((sup, idx) => (
                                                                <tr key={sup.id} className="hover:bg-aqar-base/50 transition-colors">
                                                                    <td className="py-3 font-semibold text-aqar-text flex items-center gap-2">
                                                                        <span className="w-5 h-5 rounded-full bg-aqar-base border border-aqar-border flex items-center justify-center font-mono text-[10px] text-aqar-cyan">
                                                                            {idx + 1}
                                                                        </span>
                                                                        {sup.name}
                                                                    </td>
                                                                    <td className="py-3 text-center font-mono text-aqar-text">{sup.totalAssigned}</td>
                                                                    <td className="py-3 text-center font-mono font-bold text-emerald-400">{sup.closedWon}</td>
                                                                    <td className="py-3 text-center font-mono text-rose-400">{sup.closedLost}</td>
                                                                    <td className="py-3 text-end font-mono font-bold text-aqar-cyan">
                                                                        {sup.conversionRate}%
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-aqar-muted text-center py-6">لا يوجد مشرفين مسجلين بعد</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SUPERVISORS MANAGEMENT TAB (ADMIN ONLY) */}
                            {tab === "supervisors" && isAdmin && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-aqar-text text-xl font-bold">فريق المشرفين والوكلاء</h2>
                                            <p className="text-aqar-muted text-xs mt-1">
                                                إدارة حسابات المشرفين، إضافة مشرفين جدد، تخصيص الصلاحيات، وحذف الحسابات
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsAddSupervisorOpen(true)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-aqar-cyan hover:bg-aqar-cyan/90 text-aqar-btnText text-xs font-bold rounded-xl transition-all shadow-md shrink-0"
                                        >
                                            <UserPlus size={16} /> إضافة مشرف جديد
                                        </button>
                                    </div>

                                    {supervisors.length === 0 ? (
                                        <div className="text-center py-16 bg-aqar-surface border border-aqar-border rounded-2xl">
                                            <Users size={36} className="mx-auto text-aqar-muted mb-3 opacity-40" />
                                            <h3 className="text-aqar-text font-bold text-base mb-1">لا يوجد مشرفين حالياً</h3>
                                            <p className="text-aqar-muted text-xs mb-4">يمكنك إضافة أول مشرف في فريقك لبدء توزيع العملاء وإدارة العقارات</p>
                                            <button
                                                onClick={() => setIsAddSupervisorOpen(true)}
                                                className="px-5 py-2.5 bg-aqar-cyan text-aqar-btnText text-xs font-bold rounded-xl shadow-md"
                                            >
                                                + إضافة أول مشرف الآن
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {supervisors.map((sup) => {
                                                const supLeads = leads.filter((l) => l.assigned_to === sup.id);
                                                const wonCount = supLeads.filter((l) => l.status === "closed_won").length;

                                                return (
                                                    <div key={sup.id} className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-6 flex flex-col justify-between">
                                                        <div>
                                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-12 h-12 rounded-xl bg-aqar-cyan/10 border border-aqar-cyan/30 flex items-center justify-center text-aqar-cyan font-bold text-lg">
                                                                        {sup.full_name ? sup.full_name.charAt(0) : "م"}
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <h3 className="text-aqar-text font-bold text-base">{sup.full_name}</h3>
                                                                            {sup.role === "admin" && (
                                                                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-aqar-cyan/15 text-aqar-cyan border border-aqar-cyan/30">
                                                                                    مدير النظام
                                                                                </span>
                                                                            )}
                                                                        </div>
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
                                                            <div className="space-y-1.5 text-xs text-aqar-muted pt-3 border-t border-aqar-border mb-4">
                                                                <div className="flex items-center justify-between">
                                                                    <span>نشر وإضافة عقارات جديدة:</span>
                                                                    <span className={`font-semibold ${sup.permissions?.can_add_properties ? "text-emerald-400" : "text-rose-400"}`}>
                                                                        {sup.permissions?.can_add_properties ? "مسموح" : "محظور"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <span>استلام العملاء غير الموزعين:</span>
                                                                    <span className={`font-semibold ${sup.permissions?.can_claim_unassigned_leads ? "text-emerald-400" : "text-rose-400"}`}>
                                                                        {sup.permissions?.can_claim_unassigned_leads ? "مسموح" : "محظور"}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <span>الاطلاع على عملاء الزملاء:</span>
                                                                    <span className="text-rose-400 font-semibold">محظور (منع التعارض)</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Actions: Toggle Status & Delete */}
                                                        {sup.role !== "admin" && (
                                                            <div className="flex items-center justify-between gap-3 pt-3 border-t border-aqar-border mt-auto">
                                                                <button
                                                                    onClick={() => handleToggleSupervisorStatus(sup.id, sup.is_active)}
                                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                                                        sup.is_active
                                                                            ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                                                                            : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                                                    }`}
                                                                >
                                                                    {sup.is_active ? "تعطيل الحساب" : "تفعيل الحساب"}
                                                                </button>

                                                                <button
                                                                    onClick={() => handleDeleteSupervisor(sup.id, sup.full_name)}
                                                                    disabled={deletingSupervisorId === sup.id}
                                                                    title="حذف حساب المشرف نهائياً"
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors text-xs font-semibold disabled:opacity-50"
                                                                >
                                                                    {deletingSupervisorId === sup.id ? (
                                                                        <Loader2 size={13} className="animate-spin" />
                                                                    ) : (
                                                                        <Trash2 size={13} />
                                                                    )}
                                                                    حذف المشرف
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Pagination Controls */}
                                    <div className="flex items-center justify-between mt-4">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-4 py-2 bg-aqar-base border border-aqar-border rounded-xl text-xs disabled:opacity-50"
                                        >
                                            السابق
                                        </button>
                                        <span className="text-xs text-aqar-muted">الصفحة {page}</span>
                                        <button
                                            onClick={() => setPage((p) => p + 1)}
                                            disabled={supervisors.length < limit}
                                            className="px-4 py-2 bg-aqar-base border border-aqar-border rounded-xl text-xs disabled:opacity-50"
                                        >
                                            التالي
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PROPERTIES TAB */}
                            {tab === "properties" && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-aqar-text text-xl font-bold">إدارة العقارات</h2>
                                            <p className="text-aqar-muted text-xs mt-1">
                                                {isAdmin ? "قائمة بجميع العقارات المنشورة أو المؤرشفة في النظام" : "العقارات المتاحة والمعروضة"}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="flex items-center gap-1.5 bg-aqar-surface border border-aqar-border p-1 rounded-xl">
                                                <button
                                                    onClick={() => setPropertyFilter("active")}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                                        propertyFilter === "active" ? "bg-aqar-cyan text-aqar-btnText" : "text-aqar-muted hover:text-aqar-text"
                                                    }`}
                                                >
                                                    العقارات المعروضة ({properties.length})
                                                </button>
                                                <button
                                                    onClick={() => setPropertyFilter("archived")}
                                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                                                        propertyFilter === "archived" ? "bg-amber-500 text-white" : "text-aqar-muted hover:text-aqar-text"
                                                    }`}
                                                >
                                                    <Archive size={12} /> الأرشيف ({archivedProperties.length})
                                                </button>
                                            </div>

                                            <Link
                                                to="/list-property"
                                                className="px-4 py-2 bg-aqar-cyan hover:bg-aqar-cyan/90 text-aqar-btnText text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
                                            >
                                                <PlusCircle size={14} /> إضافة عقار جديد
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Grid of active / archived properties */}
                                    {((propertyFilter === "active" ? properties : archivedProperties).length > 0) ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {(propertyFilter === "active" ? properties : archivedProperties).map((p) => (
                                                <PropertyCard 
                                                    key={p.id} 
                                                    property={p} 
                                                    isDashboard={true} 
                                                    onDelete={handleDeleteProperty}
                                                    onArchive={handleArchiveProperty}
                                                    onRestore={handleRestoreProperty}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-12 text-center">
                                            <Home size={36} className="text-aqar-muted mx-auto mb-3" />
                                            <p className="text-aqar-text font-bold text-sm">
                                                {propertyFilter === "active" ? "لا توجد عقارات منشورة حالياً" : "سجل الأرشيف فارغ"}
                                            </p>
                                        </div>
                                    )}

                                    {/* Pagination Controls */}
                                    <div className="flex items-center justify-between mt-4">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                            className="px-4 py-2 bg-aqar-base border border-aqar-border rounded-xl text-xs disabled:opacity-50"
                                        >
                                            السابق
                                        </button>
                                        <span className="text-xs text-aqar-muted">الصفحة {page}</span>
                                        <button
                                            onClick={() => setPage((p) => p + 1)}
                                            disabled={(propertyFilter === "active" ? properties : archivedProperties).length < limit}
                                            className="px-4 py-2 bg-aqar-base border border-aqar-border rounded-xl text-xs disabled:opacity-50"
                                        >
                                            التالي
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* SETTINGS TAB */}
                            {tab === "settings" && (
                                <div className="space-y-6 max-w-xl">
                                    <div className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-6">
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
                                                className="px-6 py-2.5 bg-aqar-cyan hover:bg-aqar-cyan/90 text-aqar-btnText font-bold rounded-xl transition-colors mt-2"
                                            >
                                                حفظ التعديلات
                                            </button>
                                        </div>
                                    </div>

                                    {/* SESSION & CACHE MANAGEMENT CARD */}
                                    <div className="bg-aqar-surface border border-aqar-border shadow-sm dark:shadow-none rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <HardDrive className="text-aqar-cyan" size={20} />
                                                <h3 className="text-aqar-text font-bold text-base">إدارة الجلسات والذاكرة المؤقتة (Cache)</h3>
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                                الإصدار v{cacheManager.getVersion()}
                                            </span>
                                        </div>

                                        <p className="text-xs text-aqar-muted mb-4 leading-relaxed">
                                            يقوم النظام تلقائياً بتنظيف البيانات المؤقتة عند كل تحديث لمنع تداخل الحسابات. يمكنك من هنا فحص استهلاك الذاكرة أو تفريغ الكاش يدوياً لضمان أعلى سرعة استجابة.
                                        </p>

                                        {/* Storage Stats */}
                                        <div className="grid grid-cols-2 gap-3 p-3.5 bg-aqar-base rounded-xl border border-aqar-border mb-5">
                                            <div>
                                                <span className="text-[11px] text-aqar-muted block">المساحة المحلية المستهلكة:</span>
                                                <span className="text-sm font-mono font-bold text-aqar-text mt-0.5 block">
                                                    {storageUsage.formattedSize}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-[11px] text-aqar-muted block">عناصر التخزين المخزنة:</span>
                                                <span className="text-sm font-mono font-bold text-aqar-cyan mt-0.5 block">
                                                    {storageUsage.itemCount} عناصر
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => {
                                                    toast.loading("جارٍ تفريغ الذاكرة المؤقتة وإعادة مزامنة البيانات...");
                                                    setTimeout(() => {
                                                        cacheManager.purgeCacheAndReload(true);
                                                    }, 800);
                                                }}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-aqar-hover hover:bg-aqar-active text-aqar-text text-xs font-semibold rounded-xl border border-aqar-border transition-colors"
                                            >
                                                <RefreshCw size={14} className="text-aqar-cyan" /> تفريغ الذاكرة المؤقتة وإعادة المزامنة (Re-sync)
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (confirm("هل تريد تسجيل الخروج ومسح جميع البيانات المحلية المحفوظة على هذا الجهاز؟")) {
                                                        cacheManager.purgeCacheAndReload(false);
                                                    }
                                                }}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl border border-rose-500/30 transition-colors"
                                            >
                                                <LogOut size={14} /> إنهاء جميع الجلسات ومسح البيانات المحفوظة
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            {/* ADD SUPERVISOR MODAL */}
            {isAddSupervisorOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-aqar-surface border border-aqar-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 mb-4 border-b border-aqar-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-aqar-cyan/15 text-aqar-cyan border border-aqar-cyan/30">
                                    <UserPlus size={20} />
                                </div>
                                <div>
                                    <h3 className="text-aqar-text font-bold text-lg">إضافة مشرف جديد</h3>
                                    <p className="text-aqar-muted text-xs">إنشاء حساب للمشرف ومنحه صلاحيات العمل على المنصة</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsAddSupervisorOpen(false)}
                                className="p-2 rounded-xl text-aqar-muted hover:text-aqar-text hover:bg-aqar-hover transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSupervisor} className="space-y-4 text-xs">
                            <div>
                                <label className="text-aqar-text font-medium block mb-1.5">الاسم بالكامل *</label>
                                <input
                                    required
                                    value={newSupervisorForm.full_name}
                                    onChange={(e) => setNewSupervisorForm({ ...newSupervisorForm, full_name: e.target.value })}
                                    placeholder="مثال: عمر خالد"
                                    className="w-full px-4 py-2.5 bg-aqar-base border border-aqar-border rounded-xl text-aqar-text text-sm focus:border-aqar-cyan/50 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-aqar-text font-medium block mb-1.5">البريد الإلكتروني (لتسجيل الدخول) *</label>
                                <input
                                    required
                                    type="email"
                                    value={newSupervisorForm.email}
                                    onChange={(e) => setNewSupervisorForm({ ...newSupervisorForm, email: e.target.value })}
                                    placeholder="omar@aqar.com"
                                    className="w-full px-4 py-2.5 bg-aqar-base border border-aqar-border rounded-xl text-aqar-text text-sm focus:border-aqar-cyan/50 focus:outline-none"
                                    dir="ltr"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-aqar-text font-medium block mb-1.5">رقم الهاتف / واتساب</label>
                                    <input
                                        value={newSupervisorForm.phone}
                                        onChange={(e) => setNewSupervisorForm({ ...newSupervisorForm, phone: e.target.value })}
                                        placeholder="+966 50 123 4567"
                                        className="w-full px-4 py-2.5 bg-aqar-base border border-aqar-border rounded-xl text-aqar-text text-sm focus:border-aqar-cyan/50 focus:outline-none"
                                        dir="ltr"
                                    />
                                </div>
                                <div>
                                    <label className="text-aqar-text font-medium block mb-1.5">كلمة المرور الأولية *</label>
                                    <input
                                        required
                                        type="password"
                                        value={newSupervisorForm.password}
                                        onChange={(e) => setNewSupervisorForm({ ...newSupervisorForm, password: e.target.value })}
                                        placeholder="6 أحرف على الأقل"
                                        className="w-full px-4 py-2.5 bg-aqar-base border border-aqar-border rounded-xl text-aqar-text text-sm focus:border-aqar-cyan/50 focus:outline-none"
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            {/* Permissions */}
                            <div className="pt-2">
                                <label className="text-aqar-text font-bold block mb-2">صلاحيات المشرف الممنوحة:</label>
                                <div className="space-y-2.5 bg-aqar-base p-3.5 rounded-xl border border-aqar-border">
                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newSupervisorForm.permissions.can_add_properties}
                                            onChange={(e) =>
                                                setNewSupervisorForm({
                                                    ...newSupervisorForm,
                                                    permissions: { ...newSupervisorForm.permissions, can_add_properties: e.target.checked },
                                                })
                                            }
                                            className="w-4 h-4 rounded text-aqar-cyan accent-aqar-cyan"
                                        />
                                        <span className="text-aqar-text">إضافة ونشر عقارات جديدة في المنصة</span>
                                    </label>

                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newSupervisorForm.permissions.can_claim_unassigned_leads}
                                            onChange={(e) =>
                                                setNewSupervisorForm({
                                                    ...newSupervisorForm,
                                                    permissions: { ...newSupervisorForm.permissions, can_claim_unassigned_leads: e.target.checked },
                                                })
                                            }
                                            className="w-4 h-4 rounded text-aqar-cyan accent-aqar-cyan"
                                        />
                                        <span className="text-aqar-text">استلام ومتابعة العملاء غير الموزعين</span>
                                    </label>

                                    <label className="flex items-center gap-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newSupervisorForm.permissions.can_edit_all_properties}
                                            onChange={(e) =>
                                                setNewSupervisorForm({
                                                    ...newSupervisorForm,
                                                    permissions: { ...newSupervisorForm.permissions, can_edit_all_properties: e.target.checked },
                                                })
                                            }
                                            className="w-4 h-4 rounded text-aqar-cyan accent-aqar-cyan"
                                        />
                                        <span className="text-aqar-text">تعديل بيانات عقارات الزملاء</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-aqar-border">
                                <button
                                    type="button"
                                    onClick={() => setIsAddSupervisorOpen(false)}
                                    className="px-5 py-2.5 border border-aqar-border text-aqar-muted hover:text-aqar-text rounded-xl transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={addingSupervisor}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-aqar-cyan hover:bg-aqar-cyan/90 text-aqar-btnText font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
                                >
                                    {addingSupervisor ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> جارٍ إنشاء الحساب...
                                        </>
                                    ) : (
                                        "إنشاء وتفعيل الحساب فوراً"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
