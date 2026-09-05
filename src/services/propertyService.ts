import { supabase } from "@/lib/supabase";
import { MOCK_PROPERTIES } from "@/constants/mockData";
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
     * Get all properties (public, merges Supabase dynamic properties with mock seed data)
     */
    async getAll(): Promise<Property[]> {
        try {
            const { data, error } = await supabase
                .from("properties")
                .select("*")
                .eq("is_published", true)
                .order("created_at", { ascending: false });

            if (error || !data || data.length === 0) {
                return MOCK_PROPERTIES;
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
            }));

            // Merge dynamic properties on top of mock properties
            return [...mappedDbProperties, ...MOCK_PROPERTIES];
        } catch (err) {
            console.error("Failed to load properties from Supabase:", err);
            return MOCK_PROPERTIES;
        }
    },

    /**
     * Create a property in Supabase
     */
    async create(input: CreatePropertyInput, userId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const slug = input.title
                .toLowerCase()
                .trim()
                .replace(/[\s\W-]+/g, "-") + `-${Date.now()}`;

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
                        created_by: userId || null,
                    },
                ])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (err: any) {
            console.error("Error creating property in Supabase:", err);
            return { success: false, error: err.message };
        }
    },
};
