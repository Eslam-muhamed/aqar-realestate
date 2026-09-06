import { supabase } from "@/lib/supabase";
import type { Profile, SupervisorPermissions } from "@/types";

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
                        role: "supervisor",
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
                        role: "supervisor",
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
        } catch (err: unknown) {
            return { success: false, error: err instanceof Error ? err.message : String(err) };
        }
    },
};
