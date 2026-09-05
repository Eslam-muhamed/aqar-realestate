import type { Property, Agent, Location } from "@/types";



export const MOCK_LOCATIONS: Location[] = [
    { id: "1", slug: "riyadh", name: "Riyadh", country: "Saudi Arabia", image: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=800&q=80", properties: 248, avgPrice: 3200000, types: ["Villa", "Apartment", "Penthouse", "Townhouse"], description: "Saudi Arabia's capital and commercial hub, offering some of the region's most prestigious residential addresses." },
    { id: "2", slug: "jeddah", name: "Jeddah", country: "Saudi Arabia", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80", properties: 186, avgPrice: 2800000, types: ["Villa", "Apartment", "Townhouse"], description: "The Red Sea gateway, blending historic charm with modern luxury along Saudi Arabia's western coast." },
    { id: "3", slug: "dubai", name: "Dubai", country: "UAE", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", properties: 312, avgPrice: 4100000, types: ["Apartment", "Villa", "Penthouse", "Duplex"], description: "The UAE's global city, home to iconic architecture and some of the world's most sought-after residential addresses." },
    { id: "4", slug: "abu-dhabi", name: "Abu Dhabi", country: "UAE", image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80", properties: 124, avgPrice: 5200000, types: ["Villa", "Apartment", "Penthouse"], description: "The UAE capital, combining political significance with exclusive residential living along its beautiful corniche." },
    { id: "5", slug: "al-khobar", name: "Al Khobar", country: "Saudi Arabia", image: "https://images.unsplash.com/photo-1571406384956-03a3c9bba03f?w=800&q=80", properties: 89, avgPrice: 1900000, types: ["Villa", "Apartment"], description: "Eastern Province's most sought-after city for expatriate and executive residential living." },
    { id: "6", slug: "cairo", name: "Cairo", country: "Egypt", image: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80", properties: 203, avgPrice: 8500000, types: ["Apartment", "Villa", "Penthouse"], description: "Egypt's capital is experiencing a luxury real estate renaissance in districts like New Cairo and Fifth Settlement." },
    { id: "7", slug: "muscat", name: "Muscat", country: "Oman", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80", properties: 67, avgPrice: 1600000, types: ["Villa", "Apartment", "Townhouse"], description: "Oman's graceful capital, offering premium properties in a city known for its cleanliness and quality of life." },
    { id: "8", slug: "kuwait-city", name: "Kuwait City", country: "Kuwait", image: "https://images.unsplash.com/photo-1571406384956-03a3c9bba03f?w=800&q=80", properties: 78, avgPrice: 2400000, types: ["Villa", "Apartment"], description: "Kuwait's capital features affluent residential districts with premium villas and modern apartment towers." }
];

export const PROPERTY_TYPES = ["Villa", "Apartment", "Penthouse", "Townhouse", "Duplex", "Commercial"];
export const CITIES = ["Riyadh", "Jeddah", "Dubai", "Abu Dhabi", "Al Khobar", "Cairo", "Muscat", "Kuwait City"];
export const BEDROOM_OPTIONS = ["Studio", "1", "2", "3", "4", "5", "6+"];
