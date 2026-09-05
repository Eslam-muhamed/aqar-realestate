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

export interface User {
    id: string;
    name: string;
    email: string;
    role: "user" | "agent" | "admin";
    avatar?: string;
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
    furnished: boolean;
    parking: boolean;
    pool: boolean;
    garden: boolean;
}
