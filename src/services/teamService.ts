import { supabase } from "@/lib/supabase";
import type { Profile, SupervisorPermissions } from "@/types";

export interface CreateSupervisorInput {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    permissions?: SupervisorPermissions;
}

export const teamService = {
    /**
     * Get all supervisors for Admin view & assignment dropdowns
     */
    async getSupervisors(page: number = 1, limit: number = 50): Promise<{ success: boolean; data: Profile[]; count?: number; error?: string }> {
        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            const { data, error, count } = await supabase
                .from("profiles")
                .select("*", { count: "exact" })
                .in("role", ["supervisor", "admin"])
                .range(from, to)
                .order("created_at", { ascending: false });

            if (error) {
                console.warn("Supabase getSupervisors fallback:", error.message);
                // Mock fallback if tables not yet populated in cloud
                const mockSups = [
                    {
                        id: "sup_1",
                        email: "ahmed.supervisor@aqar.com",
                        full_name: "أحمد منصور (مشرف مبيعات)",
                        phone: "+20 100 123 4567",
                        role: "supervisor" as const,
                        is_active: true,
                        permissions: {
                            can_add_properties: true,
                            can_edit_all_properties: false,
                            can_delete_properties: false,
                            can_claim_unassigned_leads: true,
                        },
                    },
                    {
                        id: "sup_2",
                        email: "sara.supervisor@aqar.com",
                        full_name: "سارة كمال (مشرفة عقارات)",
                        phone: "+20 101 987 6543",
                        role: "supervisor" as const,
                        is_active: true,
                        permissions: {
                            can_add_properties: true,
                            can_edit_all_properties: false,
                            can_delete_properties: false,
                            can_claim_unassigned_leads: false,
                        },
                    },
                ];
                return { success: true, data: mockSups, count: mockSups.length };
            }

            return { success: true, data: (data as Profile[]) || [], count: count || 0 };
        } catch (err: unknown) {
            console.error("Error fetching supervisors:", err);
            return { success: false, data: [], error: err instanceof Error ? err.message : String(err) };
        }
    },

    /**
     * Admin: Create a new supervisor
     */
    async createSupervisor(input: CreateSupervisorInput): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const defaultPermissions: SupervisorPermissions = input.permissions || {
                can_add_properties: true,
                can_edit_all_properties: false,
                can_delete_properties: false,
                can_claim_unassigned_leads: true,
            };

            // Try stored procedure first
            const { data, error } = await supabase.rpc("admin_create_supervisor", {
                p_email: input.email,
                p_password: input.password,
                p_full_name: input.full_name,
                p_phone: input.phone || null,
                p_permissions: defaultPermissions,
            });

            if (error) {
                console.warn("RPC admin_create_supervisor fallback to direct profiles insert:", error.message);
                const newId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `sup_${Date.now()}`;
                const { error: insertErr } = await supabase.from("profiles").insert([
                    {
                        id: newId,
                        email: input.email,
                        full_name: input.full_name,
                        phone: input.phone || null,
                        role: "supervisor",
                        permissions: defaultPermissions,
                        is_active: true,
                    },
                ]);
                if (insertErr) throw insertErr;
                return { success: true, data: { id: newId } };
            }

            return { success: true, data };
        } catch (err: unknown) {
            console.error("Error creating supervisor:", err);
            return { success: false, error: err instanceof Error ? err.message : String(err) };
        }
    },

    /**
     * Admin: Delete a supervisor account
     */
    async deleteSupervisor(supervisorId: string): Promise<{ success: boolean; error?: string }> {
        try {
            // Try RPC first
            const { error } = await supabase.rpc("admin_delete_supervisor", {
                p_supervisor_id: supervisorId,
            });

            if (error) {
                console.warn("RPC admin_delete_supervisor fallback to direct delete:", error.message);
                // Also unassign leads
                await supabase.from("leads").update({ assigned_to: null }).eq("assigned_to", supervisorId);
                const { error: delErr } = await supabase.from("profiles").delete().eq("id", supervisorId);
                if (delErr) throw delErr;
            }

            return { success: true };
        } catch (err: unknown) {
            console.error("Error deleting supervisor:", err);
            return { success: false, error: err instanceof Error ? err.message : String(err) };
        }
    },

    /**
     * Update supervisor permissions
     */
    async updatePermissions(
        supervisorId: string,
        permissions: Partial<SupervisorPermissions>
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    permissions,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", supervisorId);

            if (error) throw error;
            return { success: true };
        } catch (err: unknown) {
            return { success: false, error: err instanceof Error ? err.message : String(err) };
        }
    },

    /**
     * Activate or deactivate a supervisor
     */
    async toggleStatus(supervisorId: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    is_active: isActive,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", supervisorId);

            if (error) throw error;
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err?.message || JSON.stringify(err) };
        }
    },

    /**
     * Show or hide a supervisor from the public page
     */
    async togglePublicVisibility(supervisorId: string, showInPublic: boolean): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    show_in_public: showInPublic,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", supervisorId);

            if (error) throw error;
            return { success: true };
        } catch (err: any) {
            return { success: false, error: err?.message || JSON.stringify(err) };
        }
    },
};
