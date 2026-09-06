export interface Property {
    id: string;
    slug: string;
    title: string;
    description: string;
    type: "villa" | "apartment" | "penthouse" | "townhouse" | "duplex" | "commercial";
    status: "for-sale" | "for-rent";
    price: number;
    currency: string;
    location: {
        city: string;
        district: string;
        address: string;
        coordinates: { lat: number; lng: number };
    };
    stats: {
        bedrooms: number;
        bathrooms: number;
        area: number;
        parking: number;
        yearBuilt: number;
        floors?: number;
    };
    images: string[];
    features: string[];
    amenities: string[];
    agent: string;
    featured: boolean;
    verified: boolean;
    createdAt: string;
    views: number;
    propertyId: string;
    is_archived?: boolean;
    archived_at?: string | null;
}

export interface Agent {
    id: string;
    name: string;
    title: string;
    company: string;
    location: string;
    phone: string;
    email: string;
    avatar: string;
    listings: number;
    rating: number;
    reviews: number;
    verified: boolean;
    languages: string[];
    bio: string;
}

export interface Location {
    id: string;
    slug: string;
    name: string;
    country: string;
    image: string;
    properties: number;
    avgPrice: number;
    types: string[];
    description: string;
}

export type UserRole = "admin" | "supervisor" | "user" | "agent";

export interface SupervisorPermissions {
    can_add_properties: boolean;
    can_edit_all_properties: boolean;
    can_delete_properties: boolean;
    can_claim_unassigned_leads: boolean;
}

export interface Profile {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    avatar_url?: string;
    role: "admin" | "supervisor";
    permissions: SupervisorPermissions;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    phone?: string;
    permissions?: Partial<SupervisorPermissions>;
    is_active?: boolean;
}

export type LeadStatus = "new" | "contacted" | "meeting_scheduled" | "closed_won" | "closed_lost";

export interface Lead {
    id: string;
    property_id?: string | null;
    property_title?: string | null;
    client_name: string;
    client_phone: string;
    client_email?: string | null;
    message?: string | null;
    source?: string;
    status: LeadStatus;
    assigned_to?: string | null;
    assigned_supervisor?: { id: string; full_name: string; email: string; phone?: string } | null;
    assigned_at?: string | null;
    assigned_by?: string | null;
    internal_notes?: string;
    is_archived?: boolean;
    archived_at?: string | null;
    created_at: string;
    updated_at?: string;
}

export interface Inquiry {
    id: string;
    propertyId: string;
    propertyTitle: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    date: string;
    status: "new" | "read" | "replied";
    assignedTo?: string;
}

export type ViewMode = "grid" | "list";

export interface FilterState {
    status: "all" | "for-sale" | "for-rent";
    location: string;
    type: string;
    priceMin: string;
    priceMax: string;
    bedrooms: string;
    bathrooms: string;
    areaMin: string;
    amenities: string[];
}
