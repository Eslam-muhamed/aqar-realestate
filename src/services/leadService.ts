import { supabase } from "@/lib/supabase";
import { inquiriesStorage } from "@/lib/storage";
import type { Lead, LeadStatus } from "@/types";

export interface CreateLeadPayload {
    property_id?: string | null;
    property_title?: string | null;
    client_name: string;
    client_phone: string;
    client_email?: string | null;
    message?: string | null;
    source?: string;
}

export const leadService = {
    /**
     * Submit a new lead (accessible to public anonymous visitors)
     */
    async createLead(payload: CreateLeadPayload): Promise<{ success: boolean; data?: Lead; error?: string }> {
        try {
            const { data, error } = await supabase
                .from("leads")
                .insert([
                    {
                        property_id: payload.property_id || null,
                        property_title: payload.property_title || null,
                        client_name: payload.client_name,
                        client_phone: payload.client_phone,
                        client_email: payload.client_email || null,
                        message: payload.message || null,
                        source: payload.source || "website",
                        status: "new",
                    },
                ])
                .select()
                .single();

            if (error) {
                console.warn("Supabase lead submission fallback:", error.message);
                // Also persist locally so the user inquiry is never lost
                inquiriesStorage.add({
                    id: `inq_${Date.now()}`,
                    propertyId: payload.property_id || "",
                    propertyTitle: payload.property_title || "General Inquiry",
                    name: payload.client_name,
                    phone: payload.client_phone,
                    email: payload.client_email || "",
                    message: payload.message || "",
                    date: new Date().toISOString(),
                    status: "new",
                });
                return { success: true };
            }

            return { success: true, data };
        } catch (err: unknown) {
            console.error("Lead submission error:", err);
            return { success: false, error: err instanceof Error ? err.message : "Failed to submit lead" };
        }
    },

    /**
     * Fetch leads:
     * - Admins will receive all leads
     * - Supervisors will receive only their assigned leads (enforced by RLS in Supabase)
     */
    async getLeads(page: number = 1, limit: number = 50): Promise<{ success: boolean; data: Lead[]; count?: number; error?: string }> {
        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            const { data, error, count } = await supabase
                .from("leads")
                .select(`
                    *,
                    assigned_supervisor:profiles!leads_assigned_to_fkey (
                        id,
                        full_name,
                        email,
                        phone
                    )
                `, { count: "exact" })
                .range(from, to)
                .order("created_at", { ascending: false });

            if (error) {
                console.warn("Supabase getLeads fallback to local:", error.message);
                // Fallback to local storage inquiries
                const localInquiries = inquiriesStorage.get();
                const converted: Lead[] = localInquiries.map((inq: any) => ({
                    id: inq.id,
                    property_id: inq.propertyId,
                    property_title: inq.propertyTitle,
                    client_name: inq.name,
                    client_phone: inq.phone,
                    client_email: inq.email,
                    message: inq.message,
                    status: (inq.status === "read" ? "contacted" : inq.status) as LeadStatus,
                    assigned_to: inq.assignedTo || null,
                    created_at: inq.date || new Date().toISOString(),
                }));
                return { success: true, data: converted, count: converted.length };
            }

            return { success: true, data: data as Lead[], count: count || 0 };
        } catch (err: unknown) {
            console.error("Error fetching leads:", err);
            return { success: false, data: [], error: err instanceof Error ? err.message : String(err) };
        }
    },

    /**
     * Admin: Assign a lead to a specific supervisor (locks it to prevent collisions)
     */
    async assignLead(
        leadId: string,
        supervisorId: string | null,
        adminId?: string
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const updates = {
                assigned_to: supervisorId,
                assigned_at: supervisorId ? new Date().toISOString() : null,
                assigned_by: adminId || null,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from("leads")
                .update(updates)
                .eq("id", leadId);

            if (error) throw error;
            return { success: true };
        } catch (err: unknown) {
            console.error("Error assigning lead:", err);
            return { success: false, error: err instanceof Error ? err.message : String(err) };
        }
    },

    /**
     * Update lead status and internal notes
     * (Allowed for Admin or the assigned Supervisor)
     */
    async updateLead(
        leadId: string,
        updates: { status?: LeadStatus; internal_notes?: string }
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from("leads")
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", leadId);

            if (error) throw error;
            return { success: true };
        } catch (err: unknown) {
            console.error("Error updating lead:", err);
            return { success: false, error: err instanceof Error ? err.message : String(err) };
        }
    },

    /**
     * Admin: Delete a lead
     */
    async deleteLead(leadId: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase.from("leads").delete().eq("id", leadId);
            if (error) throw error;
            return { success: true };
        } catch (err: unknown) {
            console.error("Error deleting lead:", err);
            return { success: false, error: err instanceof Error ? err.message : String(err) };
        }
    },
};
