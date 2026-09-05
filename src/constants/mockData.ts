import type { Property, Agent, Location } from "@/types";

export const MOCK_PROPERTIES: Property[] = [
    {
        id: "1", slug: "contemporary-villa-al-malqa",
        title: "Contemporary Villa in Al Malqa",
        description: "A meticulously designed contemporary villa situated in the prestigious Al Malqa district of Riyadh. This property features expansive living spaces, premium finishes, and a private garden with a heated swimming pool. The architecture seamlessly blends modern Saudi design with international luxury standards, offering an exceptional standard of living for discerning buyers.",
        type: "villa", status: "for-sale", price: 4200000, currency: "SAR",
        location: { city: "Riyadh", district: "Al Malqa", address: "Street 45, Al Malqa District", coordinates: { lat: 24.8607, lng: 46.6739 } },
        stats: { bedrooms: 5, bathrooms: 6, area: 520, parking: 3, yearBuilt: 2022 },
        images: ["https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"],
        features: ["Private Pool", "Garden", "Smart Home", "Home Cinema", "Gym", "Maid Room", "Driver Room"],
        amenities: ["Central A/C", "Security System", "Solar Panels", "EV Charging", "Storage Room"],
        agent: "1", featured: true, verified: true, createdAt: "2024-01-15", views: 847, propertyId: "AQ-10245"
    },
    {
        id: "2", slug: "luxury-apartment-al-olaya",
        title: "Luxury Apartment in Al Olaya",
        description: "High-floor luxury apartment in the heart of Al Olaya, Riyadh's premier business and residential district. Floor-to-ceiling windows offer panoramic city views. The apartment features imported marble flooring, a chef's kitchen, and premium branded fixtures throughout. Access to building amenities including rooftop pool, fitness center, and 24-hour concierge.",
        type: "apartment", status: "for-sale", price: 1850000, currency: "SAR",
        location: { city: "Riyadh", district: "Al Olaya", address: "King Fahd Road, Al Olaya", coordinates: { lat: 24.6877, lng: 46.6797 } },
        stats: { bedrooms: 3, bathrooms: 4, area: 280, parking: 2, yearBuilt: 2021 },
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80", "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=1200&q=80", "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=1200&q=80"],
        features: ["City View", "Rooftop Pool", "Concierge", "Gym", "Meeting Rooms"],
        amenities: ["Central A/C", "Security System", "Backup Generator", "Intercom"],
        agent: "2", featured: true, verified: true, createdAt: "2024-02-03", views: 1203, propertyId: "AQ-10312"
    },
    {
        id: "3", slug: "penthouse-north-riyadh",
        title: "Penthouse Residence, North Riyadh",
        description: "An extraordinary penthouse occupying the top two floors of one of North Riyadh's most prestigious towers. This double-height residence offers unobstructed 360-degree views of the city, a wraparound terrace with an infinity pool, and interiors designed by an internationally recognized firm. A rare opportunity for those who demand the absolute best.",
        type: "penthouse", status: "for-sale", price: 8500000, currency: "SAR",
        location: { city: "Riyadh", district: "North Riyadh", address: "Northern Ring Road, Tower 3", coordinates: { lat: 24.7136, lng: 46.6753 } },
        stats: { bedrooms: 6, bathrooms: 7, area: 780, parking: 4, yearBuilt: 2023, floors: 2 },
        images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80", "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"],
        features: ["Infinity Pool", "Rooftop Terrace", "Private Elevator", "Panoramic Views", "Wine Cellar", "Spa"],
        amenities: ["Smart Home Automation", "Triple Security", "Generator Backup", "EV Charging"],
        agent: "1", featured: true, verified: true, createdAt: "2024-01-28", views: 2156, propertyId: "AQ-10089"
    },
    {
        id: "4", slug: "modern-villa-hittin",
        title: "Modern Villa in Hittin",
        description: "A beautifully designed modern villa in the family-friendly Hittin district. This property offers a perfect balance of luxury and practicality, featuring a spacious layout, landscaped garden, and high-quality finishes throughout. Situated close to top international schools and major commercial centers.",
        type: "villa", status: "for-sale", price: 3100000, currency: "SAR",
        location: { city: "Riyadh", district: "Hittin", address: "Al Hittin District, Street 12", coordinates: { lat: 24.7911, lng: 46.6241 } },
        stats: { bedrooms: 4, bathrooms: 5, area: 450, parking: 2, yearBuilt: 2020 },
        images: ["https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=1200&q=80", "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80", "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&q=80"],
        features: ["Garden", "Pool", "Majlis", "Maid Room", "Storage"],
        amenities: ["Central A/C", "Security System", "Backup Generator"],
        agent: "3", featured: false, verified: true, createdAt: "2024-03-10", views: 621, propertyId: "AQ-10401"
    },
    {
        id: "5", slug: "sea-view-apartment-jeddah-corniche",
        title: "Sea View Apartment, Jeddah Corniche",
        description: "A prime sea-facing apartment on the iconic Jeddah Corniche. Wake up to uninterrupted Red Sea views from the master bedroom and expansive living area. The building offers world-class amenities and is located walking distance from premier dining and entertainment on the corniche promenade.",
        type: "apartment", status: "for-sale", price: 2200000, currency: "SAR",
        location: { city: "Jeddah", district: "Al Corniche", address: "Corniche Road, Block 7", coordinates: { lat: 21.5433, lng: 39.1728 } },
        stats: { bedrooms: 3, bathrooms: 3, area: 240, parking: 2, yearBuilt: 2022 },
        images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80", "https://images.unsplash.com/photo-1600210491892-03d54079b6ac?w=1200&q=80"],
        features: ["Sea View", "Pool", "Gym", "Concierge", "Beach Access"],
        amenities: ["Central A/C", "Security System", "Intercom"],
        agent: "4", featured: true, verified: true, createdAt: "2024-02-20", views: 934, propertyId: "AQ-10502"
    },
    {
        id: "6", slug: "garden-villa-jeddah-al-rawdah",
        title: "Garden Villa in Al Rawdah, Jeddah",
        description: "An elegant family villa nestled in the prestigious Al Rawdah neighborhood of Jeddah. Mature trees line the perimeter, providing natural privacy. The villa features a formal reception, family sitting area, and beautifully landscaped gardens perfect for outdoor entertaining.",
        type: "villa", status: "for-sale", price: 5600000, currency: "SAR",
        location: { city: "Jeddah", district: "Al Rawdah", address: "Street 8, Al Rawdah", coordinates: { lat: 21.5891, lng: 39.1736 } },
        stats: { bedrooms: 6, bathrooms: 7, area: 680, parking: 3, yearBuilt: 2019 },
        images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80", "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80", "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80"],
        features: ["Mature Garden", "Pool", "Majlis", "Driver Accommodation", "Outdoor Kitchen"],
        amenities: ["Central A/C", "Security Cameras", "Backup Generator", "Water Softener"],
        agent: "4", featured: false, verified: true, createdAt: "2024-01-05", views: 512, propertyId: "AQ-10615"
    },
    {
        id: "7", slug: "duplex-apartment-dubai-marina",
        title: "Duplex Apartment, Dubai Marina",
        description: "A spectacular duplex apartment in the heart of Dubai Marina. Spanning two floors with a private terrace overlooking the marina and city skyline, this property offers the ultimate urban luxury lifestyle. Walking distance to premier restaurants, The Beach at JBR, and major transport links.",
        type: "duplex", status: "for-sale", price: 3800000, currency: "AED",
        location: { city: "Dubai", district: "Dubai Marina", address: "Marina Walk, Tower 24", coordinates: { lat: 25.0772, lng: 55.1336 } },
        stats: { bedrooms: 4, bathrooms: 5, area: 380, parking: 2, yearBuilt: 2021, floors: 2 },
        images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80", "https://images.unsplash.com/photo-1600210491869-e6e4e7e7e8bb?w=1200&q=80"],
        features: ["Marina View", "Private Terrace", "Gym", "Pool", "Concierge", "24hr Security"],
        amenities: ["Central A/C", "Smart Home", "EV Charging", "Storage"],
        agent: "5", featured: true, verified: true, createdAt: "2024-03-01", views: 1876, propertyId: "AQ-10722"
    },
    {
        id: "8", slug: "studio-apartment-riyadh-for-rent",
        title: "Furnished Studio, Al Olaya",
        description: "A fully furnished premium studio in the most sought-after address in Riyadh. Ideal for professionals and executives. The studio features high-end furnishings, a fully equipped kitchen, and access to hotel-style building amenities. Available immediately.",
        type: "apartment", status: "for-rent", price: 85000, currency: "SAR",
        location: { city: "Riyadh", district: "Al Olaya", address: "King Fahd Road, Serviced Residences", coordinates: { lat: 24.6901, lng: 46.6820 } },
        stats: { bedrooms: 0, bathrooms: 1, area: 65, parking: 1, yearBuilt: 2020 },
        images: ["https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"],
        features: ["Fully Furnished", "Gym", "Pool", "Concierge", "Housekeeping"],
        amenities: ["Central A/C", "High-Speed Internet", "All Bills Included"],
        agent: "2", featured: false, verified: true, createdAt: "2024-03-20", views: 445, propertyId: "AQ-10833"
    },
    {
        id: "9", slug: "townhouse-al-nakheel-riyadh",
        title: "Corner Townhouse in Al Nakheel",
        description: "A premium corner townhouse in the highly desirable Al Nakheel compound. This end-unit benefits from additional windows and a larger garden plot. The compound offers 24-hour security, shared pools, and a community center.",
        type: "townhouse", status: "for-sale", price: 2750000, currency: "SAR",
        location: { city: "Riyadh", district: "Al Nakheel", address: "Al Nakheel Compound, Unit 44", coordinates: { lat: 24.8102, lng: 46.7023 } },
        stats: { bedrooms: 4, bathrooms: 4, area: 320, parking: 2, yearBuilt: 2021 },
        images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80", "https://images.unsplash.com/photo-1590725121839-892b458a74fe?w=1200&q=80", "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=1200&q=80"],
        features: ["Corner Unit", "Garden", "Compound Pool", "Security"],
        amenities: ["Central A/C", "Security System", "Community Center"],
        agent: "3", featured: false, verified: true, createdAt: "2024-02-14", views: 389, propertyId: "AQ-10944"
    },
    {
        id: "10", slug: "waterfront-villa-abu-dhabi",
        title: "Waterfront Villa, Abu Dhabi Corniche",
        description: "An exclusive waterfront villa with direct access to the Abu Dhabi corniche. This rare property offers private beach access, a boat dock, and unobstructed sea views from all principal rooms. Designed by a leading architectural firm, the property combines traditional Arabic architectural elements with contemporary luxury.",
        type: "villa", status: "for-sale", price: 12500000, currency: "AED",
        location: { city: "Abu Dhabi", district: "Corniche", address: "Corniche Road West, Plot 11", coordinates: { lat: 24.4539, lng: 54.3773 } },
        stats: { bedrooms: 7, bathrooms: 8, area: 950, parking: 5, yearBuilt: 2022 },
        images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=80", "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80", "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80"],
        features: ["Private Beach", "Boat Dock", "Infinity Pool", "Home Cinema", "Spa", "Staff Quarters"],
        amenities: ["Smart Home", "Security System", "Generator", "EV Charging", "Solar Panels"],
        agent: "6", featured: true, verified: true, createdAt: "2024-01-20", views: 3241, propertyId: "AQ-11001"
    },
    {
        id: "11", slug: "apartment-for-rent-jeddah",
        title: "Furnished 2BR Apartment, Al Hamra",
        description: "A beautifully furnished two-bedroom apartment in Jeddah's upscale Al Hamra district. Recently renovated with contemporary furnishings and fully equipped. Ideal for executives or small families looking for a premium rental option close to business districts.",
        type: "apartment", status: "for-rent", price: 95000, currency: "SAR",
        location: { city: "Jeddah", district: "Al Hamra", address: "Al Hamra District, Block 3", coordinates: { lat: 21.5630, lng: 39.1513 } },
        stats: { bedrooms: 2, bathrooms: 2, area: 150, parking: 1, yearBuilt: 2019 },
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"],
        features: ["Fully Furnished", "Sea View", "Pool", "Gym"],
        amenities: ["Central A/C", "High-Speed Internet", "Security"],
        agent: "4", featured: false, verified: true, createdAt: "2024-03-15", views: 267, propertyId: "AQ-11102"
    },
    {
        id: "12", slug: "luxury-compound-villa-riyadh",
        title: "Luxury Compound Villa, Al Yasmin",
        description: "A stunning compound villa in the prestigious Al Yasmin area of Riyadh. This recently built property features premium Italian marble throughout, a state-of-the-art kitchen, and a beautifully landscaped garden with a private pool. The compound provides 24-hour security and access to a community clubhouse.",
        type: "villa", status: "for-sale", price: 3650000, currency: "SAR",
        location: { city: "Riyadh", district: "Al Yasmin", address: "Al Yasmin Villas, Gate 3", coordinates: { lat: 24.8411, lng: 46.7114 } },
        stats: { bedrooms: 5, bathrooms: 5, area: 480, parking: 2, yearBuilt: 2023 },
        images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"],
        features: ["Pool", "Garden", "Majlis", "Gym", "Maid Room", "Storage"],
        amenities: ["Central A/C", "Smart Home", "Security System", "Backup Generator"],
        agent: "1", featured: false, verified: true, createdAt: "2024-03-22", views: 178, propertyId: "AQ-11215"
    }
];

export const MOCK_AGENTS: Agent[] = [
    {
        id: "1", name: "Khalid Al-Rashidi", title: "Senior Property Consultant",
        company: "Aqar Premium Estates", location: "Riyadh",
        phone: "+966 50 123 4567", email: "khalid@aqar.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
        listings: 24, rating: 4.9, reviews: 87, verified: true,
        languages: ["Arabic", "English"], bio: "Over 12 years of experience in luxury residential sales across Riyadh. Specialist in villa and premium apartment transactions."
    },
    {
        id: "2", name: "Sarah Al-Harthi", title: "Luxury Property Specialist",
        company: "Aqar Premium Estates", location: "Riyadh",
        phone: "+966 54 234 5678", email: "sarah@aqar.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
        listings: 18, rating: 4.8, reviews: 64, verified: true,
        languages: ["Arabic", "English", "French"], bio: "Dedicated to helping clients find exceptional properties in Riyadh's most prestigious neighborhoods. Expert in high-net-worth residential deals."
    },
    {
        id: "3", name: "Mohammed Al-Ghamdi", title: "Property Investment Advisor",
        company: "Al Ghamdi Real Estate", location: "Riyadh",
        phone: "+966 55 345 6789", email: "mghamdi@alghamdi-re.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
        listings: 31, rating: 4.7, reviews: 112, verified: true,
        languages: ["Arabic", "English"], bio: "Investment-focused property consultant with deep knowledge of Riyadh's residential compounds and family housing market."
    },
    {
        id: "4", name: "Layla Al-Zahrani", title: "Jeddah Market Specialist",
        company: "Zahrani Properties", location: "Jeddah",
        phone: "+966 56 456 7890", email: "layla@zahrani-prop.com",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
        listings: 22, rating: 4.9, reviews: 93, verified: true,
        languages: ["Arabic", "English"], bio: "Jeddah's leading residential property specialist with unparalleled knowledge of prime waterfront and district properties."
    },
    {
        id: "5", name: "Ahmed Al-Mansouri", title: "UAE Property Consultant",
        company: "Emirates Prestige Realty", location: "Dubai",
        phone: "+971 50 567 8901", email: "ahmed@emiratesprestige.ae",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
        listings: 40, rating: 4.8, reviews: 156, verified: true,
        languages: ["Arabic", "English", "Urdu"], bio: "Specialist in Dubai Marina and premium residential developments. Extensive network with developers and institutional sellers."
    },
    {
        id: "6", name: "Fatima Al-Nuaimi", title: "Abu Dhabi Luxury Specialist",
        company: "Capital Luxury Realty", location: "Abu Dhabi",
        phone: "+971 55 678 9012", email: "fatima@capitalluxury.ae",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80",
        listings: 16, rating: 5.0, reviews: 48, verified: true,
        languages: ["Arabic", "English"], bio: "Abu Dhabi's most trusted luxury residential specialist, handling exclusive waterfront properties and ultra-premium residences."
    }
];

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
