import { supabase } from "@/lib/supabase";
import type { Agent } from "@/types";

export const agentService = {
    /**
     * Get all active agents (supervisors and admins)
     */
    async getAll(): Promise<Agent[]> {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("is_active", true);

            if (error || !data) return [];

            return data.map((item: any) => ({
                id: item.id,
                name: item.full_name,
                avatar: item.avatar_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
                phone: item.phone || "+966 50 000 0000",
                email: item.email,
                title: item.role === "admin" ? "مدير المكتب" : "مستشار عقاري",
                company: "AMSH",
                location: "المملكة",
                listings: 0,
                rating: 5,
                reviews: 0,
                verified: true,
                languages: ["العربية"],
                bio: "مستشار عقاري معتمد",
            }));
        } catch (err) {
            console.error("Error getting agents:", err);
            return [];
        }
    },

    /**
     * Get a specific agent by ID
     */
    async getById(id: string): Promise<Agent | null> {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", id)
                .single();

            if (error || !data) return null;

            return {
                id: data.id,
                name: data.full_name,
                avatar: data.avatar_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
                phone: data.phone || "+966 50 000 0000",
                email: data.email,
                title: data.role === "admin" ? "مدير المكتب" : "مستشار عقاري",
                company: "AMSH",
                location: "المملكة",
                listings: 0,
                rating: 5,
                reviews: 0,
                verified: true,
                languages: ["العربية"],
                bio: "مستشار عقاري معتمد",
            };
        } catch (err) {
            console.error("Error getting agent by id:", err);
            return null;
        }
    }
};
