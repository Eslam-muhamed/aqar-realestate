import { supabase } from "@/lib/supabase";
import type { Property } from "@/types";

export interface CreatePropertyInput {
    title: string;
    description: string;
    type: "villa" | "apartment" | "penthouse" | "townhouse" | "duplex" | "commercial";
    status: "for-sale" | "for-rent";
    price: number;
    currency?: string;
    city: string;
    district: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    parking: number;
    yearBuilt: number;
    floors?: number;
    images: string[];
    features: string[];
    amenities: string[];
    featured?: boolean;
}

export const propertyService = {
    /**
     * Get all properties (public, only Supabase dynamic properties)
     */
    async getAll(
        page: number = 1,
        limit: number = 50,
        includeArchived: boolean = false
    ): Promise<{ data: Property[]; count: number }> {
        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            let query = supabase
                .from("properties")
                .select("*", { count: "exact" })
                .eq("is_published", true);

            if (!includeArchived) {
                query = query.or("is_archived.is.null,is_archived.eq.false");
            }

            const { data, error, count } = await query
                .range(from, to)
                .order("created_at", { ascending: false });

            if (error || !data || data.length === 0) {
                return { data: [], count: 0 };
            }

            // Map Supabase DB columns to frontend Property interface
            const mappedDbProperties: Property[] = data.map((item: any) => ({
                id: item.id,
                slug: item.slug || item.id,
                title: item.title,
                description: item.description || "",
                type: item.type,
                status: item.status,
                price: Number(item.price),
                currency: item.currency || "SAR",
                location: {
                    city: item.city || "",
                    district: item.district || "",
                    address: item.address || "",
                    coordinates: {
                        lat: Number(item.lat || 24.7136),
                        lng: Number(item.lng || 46.6753),
                    },
                },
                stats: {
                    bedrooms: item.bedrooms || 0,
                    bathrooms: item.bathrooms || 0,
                    area: Number(item.area || 0),
                    parking: item.parking || 0,
                    yearBuilt: item.year_built || new Date().getFullYear(),
                    floors: item.floors || 1,
                },
                images: item.images && item.images.length > 0 ? item.images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"],
                features: item.features || [],
                amenities: item.amenities || [],
                agent: item.created_by || "1",
                featured: !!item.featured,
                verified: !!item.verified,
                createdAt: item.created_at || new Date().toISOString(),
                views: item.views || 0,
                propertyId: item.property_id || `AQR-${Math.floor(1000 + Math.random() * 9000)}`,
                is_archived: !!item.is_archived,
                archived_at: item.archived_at || null,
            }));

            return { data: mappedDbProperties, count: count || 0 };
        } catch (err) {
            console.error("Failed to load properties from Supabase:", err);
            return { data: [], count: 0 };
        }
    },

    /**
     * Create a property in Supabase
     */
    async create(input: CreatePropertyInput, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const slug = input.title
                .trim()
                .replace(/\s+/g, "-")
                .replace(/[^\w\u0600-\u06FF-]/g, "") + `-${Date.now()}`;

            const propertyCode = `AQR-${Math.floor(10000 + Math.random() * 90000)}`;

            const { data, error } = await supabase
                .from("properties")
                .insert([
                    {
                        property_id: propertyCode,
                        slug,
                        title: input.title,
                        description: input.description,
                        type: input.type,
                        status: input.status,
                        price: input.price,
                        currency: input.currency || "SAR",
                        city: input.city,
                        district: input.district,
                        address: input.address,
                        bedrooms: input.bedrooms,
                        bathrooms: input.bathrooms,
                        area: input.area,
                        parking: input.parking,
                        year_built: input.yearBuilt,
                        floors: input.floors || 1,
                        images: input.images,
                        features: input.features,
                        amenities: input.amenities,
                        featured: !!input.featured,
                        is_published: true,
                        created_by: userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId) ? userId : null,
                    },
                ])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (err: unknown) {
            console.error("Error creating property in Supabase:", err);
            return { success: false, error: err instanceof Error ? err.message : (err as any).message || JSON.stringify(err) };
        }
    },

    /**
     * Update an existing property
     */
    async updateProperty(id: string, input: Partial<CreatePropertyInput>) {
        try {
            const updateData: any = { ...input };
            
            // Clean up structured data to match DB columns if present
            if (input.city) updateData.city = input.city;
            if (input.district) updateData.district = input.district;
            if (input.address) updateData.address = input.address;
            
            if (input.yearBuilt !== undefined) {
                updateData.year_built = input.yearBuilt;
                delete updateData.yearBuilt;
            }

            const { data, error } = await supabase
                .from("properties")
                .update(updateData)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (err: unknown) {
            console.error("Error updating property in Supabase:", err);
            return { success: false, error: err instanceof Error ? err.message : (err as any).message || JSON.stringify(err) };
        }
    },

    /**
     * Delete a property
     */
     async deleteProperty(id: string) {
         try {
             const { error } = await supabase
                 .from("properties")
                 .delete()
                 .eq("id", id);

             if (error) throw error;
             return { success: true };
         } catch (err: unknown) {
             console.error("Error deleting property in Supabase:", err);
             return { success: false, error: err instanceof Error ? err.message : (err as any).message || JSON.stringify(err) };
         }
     },

    /**
     * Archive a property (move from active listings to archive)
     */
    async archiveProperty(id: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from("properties")
                .update({ 
                    is_archived: true, 
                    archived_at: new Date().toISOString() 
                })
                .eq("id", id);

            if (error) throw error;
            return { success: true };
        } catch (err: unknown) {
            console.error("Error archiving property:", err);
            return { success: false, error: err instanceof Error ? err.message : (err as any).message || JSON.stringify(err) };
        }
    },

    /**
     * Restore an archived property back to active listings
     */
    async restoreProperty(id: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from("properties")
                .update({ 
                    is_archived: false, 
                    archived_at: null 
                })
                .eq("id", id);

            if (error) throw error;
            return { success: true };
        } catch (err: unknown) {
            console.error("Error restoring property:", err);
            return { success: false, error: err instanceof Error ? err.message : (err as any).message || JSON.stringify(err) };
        }
    },

    /**
     * Fetch only archived properties
     */
    async getArchived(page: number = 1, limit: number = 50): Promise<{ data: Property[]; count: number }> {
        try {
            const from = (page - 1) * limit;
            const to = from + limit - 1;

            const { data, error, count } = await supabase
                .from("properties")
                .select("*", { count: "exact" })
                .eq("is_archived", true)
                .range(from, to)
                .order("archived_at", { ascending: false });

            if (error || !data || data.length === 0) {
                return { data: [], count: 0 };
            }

            const mapped: Property[] = data.map((item: any) => ({
                id: item.id,
                slug: item.slug || item.id,
                title: item.title,
                description: item.description || "",
                type: item.type,
                status: item.status,
                price: Number(item.price),
                currency: item.currency || "SAR",
                location: {
                    city: item.city || "",
                    district: item.district || "",
                    address: item.address || "",
                    coordinates: {
                        lat: Number(item.lat || 24.7136),
                        lng: Number(item.lng || 46.6753),
                    },
                },
                stats: {
                    bedrooms: item.bedrooms || 0,
                    bathrooms: item.bathrooms || 0,
                    area: Number(item.area || 0),
                    parking: item.parking || 0,
                    yearBuilt: item.year_built || new Date().getFullYear(),
                    floors: item.floors || 1,
                },
                images: item.images && item.images.length > 0 ? item.images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"],
                features: item.features || [],
                amenities: item.amenities || [],
                agent: item.created_by || "1",
                featured: !!item.featured,
                verified: !!item.verified,
                createdAt: item.created_at || new Date().toISOString(),
                views: item.views || 0,
                propertyId: item.property_id || `AQR-${Math.floor(1000 + Math.random() * 9000)}`,
                is_archived: true,
                archived_at: item.archived_at || null,
            }));

            return { data: mapped, count: count || 0 };
        } catch (err) {
            console.error("Error loading archived properties:", err);
            return { data: [], count: 0 };
        }
    },

    /**
     * Get property by slug or ID
     */
    async getBySlug(slug: string): Promise<Property | null> {
        try {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
            let query = supabase.from("properties").select("*");
            
            if (isUuid) {
                query = query.or(`slug.eq.${slug},id.eq.${slug}`);
            } else {
                query = query.eq("slug", slug);
            }
            
            const { data, error } = await query.single();

            if (error || !data) return null;

            return {
                id: data.id,
                slug: data.slug || data.id,
                title: data.title,
                description: data.description || "",
                type: data.type,
                status: data.status,
                price: Number(data.price),
                currency: data.currency || "SAR",
                location: {
                    city: data.city || "",
                    district: data.district || "",
                    address: data.address || "",
                    coordinates: {
                        lat: Number(data.lat || 24.7136),
                        lng: Number(data.lng || 46.6753),
                    },
                },
                stats: {
                    bedrooms: data.bedrooms || 0,
                    bathrooms: data.bathrooms || 0,
                    area: Number(data.area || 0),
                    parking: data.parking || 0,
                    yearBuilt: data.year_built || new Date().getFullYear(),
                    floors: data.floors || 1,
                },
                images: data.images && data.images.length > 0 ? data.images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"],
                features: data.features || [],
                amenities: data.amenities || [],
                agent: data.created_by || "1",
                featured: !!data.featured,
                verified: !!data.verified,
                createdAt: data.created_at || new Date().toISOString(),
                views: data.views || 0,
                propertyId: data.property_id || `AQR-${Math.floor(1000 + Math.random() * 9000)}`,
            };
        } catch (err) {
            console.error("Error getting property by slug:", err);
            return null;
        }
    },

    /**
     * Get similar properties by city
     */
    async getSimilar(city: string, limit: number = 3): Promise<Property[]> {
        try {
            const { data, error } = await supabase
                .from("properties")
                .select("*")
                .eq("city", city)
                .eq("is_published", true)
                .limit(limit);
                
            if (error || !data) return [];
            
            return data.map((item: any) => ({
                id: item.id,
                slug: item.slug || item.id,
                title: item.title,
                description: item.description || "",
                type: item.type,
                status: item.status,
                price: Number(item.price),
                currency: item.currency || "SAR",
                location: {
                    city: item.city || "",
                    district: item.district || "",
                    address: item.address || "",
                    coordinates: {
                        lat: Number(item.lat || 24.7136),
                        lng: Number(item.lng || 46.6753),
                    },
                },
                stats: {
                    bedrooms: item.bedrooms || 0,
                    bathrooms: item.bathrooms || 0,
                    area: Number(item.area || 0),
                    parking: item.parking || 0,
                    yearBuilt: item.year_built || new Date().getFullYear(),
                    floors: item.floors || 1,
                },
                images: item.images && item.images.length > 0 ? item.images : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"],
                features: item.features || [],
                amenities: item.amenities || [],
                agent: item.created_by || "1",
                featured: !!item.featured,
                verified: !!item.verified,
                createdAt: item.created_at || new Date().toISOString(),
                views: item.views || 0,
                propertyId: item.property_id || `AQR-${Math.floor(1000 + Math.random() * 9000)}`,
            }));
        } catch (err) {
            console.error("Error getting similar properties:", err);
            return [];
        }
    }
};
