import type { Lead, Property, Profile } from "@/types";

export interface AnalyticsSummary {
    totalLeads: number;
    activeLeads: number;
    archivedLeads: number;
    closedWonCount: number;
    closedLostCount: number;
    conversionRate: number;
    
    totalProperties: number;
    activeProperties: number;
    archivedProperties: number;
    forSaleCount: number;
    forRentCount: number;
    avgSalePrice: number;
    avgRentPrice: number;

    leadsByStatus: Record<string, number>;
    leadsBySource: Record<string, number>;
    propertiesByType: Record<string, number>;
    propertiesByCity: Record<string, number>;
    supervisorPerformance: {
        id: string;
        name: string;
        totalAssigned: number;
        closedWon: number;
        closedLost: number;
        conversionRate: number;
    }[];
}

export const analyticsService = {
    /**
     * Compute analytics metrics from existing in-memory state or fetched sets
     */
    computeMetrics(
        leads: Lead[],
        properties: Property[],
        supervisors: Profile[],
        archivedLeadsCount: number = 0,
        archivedPropertiesCount: number = 0
    ): AnalyticsSummary {
        const totalLeads = leads.length + archivedLeadsCount;
        const activeLeads = leads.length;
        
        let closedWonCount = 0;
        let closedLostCount = 0;
        const leadsByStatus: Record<string, number> = {};
        const leadsBySource: Record<string, number> = {};

        leads.forEach((l) => {
            // Status counts
            leadsByStatus[l.status] = (leadsByStatus[l.status] || 0) + 1;
            if (l.status === "closed_won") closedWonCount++;
            if (l.status === "closed_lost") closedLostCount++;

            // Source counts
            const src = l.source || "موقع الويب";
            leadsBySource[src] = (leadsBySource[src] || 0) + 1;
        });

        const finishedDeals = closedWonCount + closedLostCount;
        const conversionRate = finishedDeals > 0 
            ? Math.round((closedWonCount / finishedDeals) * 100) 
            : leads.length > 0 
                ? Math.round((closedWonCount / leads.length) * 100) 
                : 0;

        // Properties stats
        const totalProperties = properties.length + archivedPropertiesCount;
        const activeProperties = properties.length;
        let forSaleCount = 0;
        let forRentCount = 0;
        let saleTotalPrice = 0;
        let rentTotalPrice = 0;
        const propertiesByType: Record<string, number> = {};
        const propertiesByCity: Record<string, number> = {};

        properties.forEach((p) => {
            if (p.status === "for-sale") {
                forSaleCount++;
                saleTotalPrice += p.price || 0;
            } else {
                forRentCount++;
                rentTotalPrice += p.price || 0;
            }

            // Type
            const type = p.type || "other";
            propertiesByType[type] = (propertiesByType[type] || 0) + 1;

            // City
            const city = p.location?.city || "غير محدد";
            propertiesByCity[city] = (propertiesByCity[city] || 0) + 1;
        });

        const avgSalePrice = forSaleCount > 0 ? Math.round(saleTotalPrice / forSaleCount) : 0;
        const avgRentPrice = forRentCount > 0 ? Math.round(rentTotalPrice / forRentCount) : 0;

        // Supervisors Leaderboard
        const supervisorPerformance = supervisors.map((sup) => {
            const assignedLeads = leads.filter((l) => l.assigned_to === sup.id);
            const supWon = assignedLeads.filter((l) => l.status === "closed_won").length;
            const supLost = assignedLeads.filter((l) => l.status === "closed_lost").length;
            const supFinished = supWon + supLost;
            const supConv = supFinished > 0 ? Math.round((supWon / supFinished) * 100) : 0;

            return {
                id: sup.id,
                name: sup.full_name || sup.email,
                totalAssigned: assignedLeads.length,
                closedWon: supWon,
                closedLost: supLost,
                conversionRate: supConv,
            };
        }).sort((a, b) => b.closedWon - a.closedWon);

        return {
            totalLeads,
            activeLeads,
            archivedLeads: archivedLeadsCount,
            closedWonCount,
            closedLostCount,
            conversionRate,
            totalProperties,
            activeProperties,
            archivedProperties: archivedPropertiesCount,
            forSaleCount,
            forRentCount,
            avgSalePrice,
            avgRentPrice,
            leadsByStatus,
            leadsBySource,
            propertiesByType,
            propertiesByCity,
            supervisorPerformance,
        };
    },

    /**
     * Export Leads to CSV formatted for Microsoft Excel with UTF-8 BOM
     */
    exportLeadsToCSV(leads: Lead[], filename = "aqar_leads_report.csv") {
        const headers = [
            "اسم العميل",
            "رقم الهاتف",
            "البريد الإلكتروني",
            "حالة الطلب",
            "العقار المطلوب",
            "المشرف المسؤول",
            "تاريخ الطلب",
            "ملاحظات داخلية",
        ];

        const rows = leads.map((l) => [
            `"${(l.client_name || "").replace(/"/g, '""')}"`,
            `"${(l.client_phone || "").replace(/"/g, '""')}"`,
            `"${(l.client_email || "").replace(/"/g, '""')}"`,
            `"${l.status}"`,
            `"${(l.property_title || "طلب عام").replace(/"/g, '""')}"`,
            `"${(l.assigned_supervisor?.full_name || "غير معين").replace(/"/g, '""')}"`,
            `"${l.created_at ? new Date(l.created_at).toLocaleDateString("ar-EG") : ""}"`,
            `"${(l.internal_notes || "").replace(/"/g, '""')}"`,
        ]);

        const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    /**
     * Export Executive Summary KPI Report to CSV
     */
    exportExecutiveSummaryToCSV(metrics: AnalyticsSummary, filename = "aqar_executive_kpi.csv") {
        const rows = [
            ["المؤشر", "القيمة"],
            ["إجمالي العملاء المستلمين", metrics.totalLeads],
            ["العملاء النشطين حالياً", metrics.activeLeads],
            ["العملاء في الأرشيف", metrics.archivedLeads],
            ["الصفقات الناجحة (Closed Won)", metrics.closedWonCount],
            ["الصفقات الملغاة (Closed Lost)", metrics.closedLostCount],
            ["معدل تحويل الصفقات الإجمالي", `${metrics.conversionRate}%`],
            ["إجمالي العقارات المعروضة", metrics.activeProperties],
            ["عقارات للبيع", metrics.forSaleCount],
            ["عقارات للإيجار", metrics.forRentCount],
            ["متوسط سعر البيع", `${metrics.avgSalePrice.toLocaleString()} ر.س`],
            ["متوسط سعر الإيجار", `${metrics.avgRentPrice.toLocaleString()} ر.س`],
        ];

        const csvContent = "\uFEFF" + rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\r\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
};
