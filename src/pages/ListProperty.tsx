import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { PROPERTY_TYPES, CITIES } from "@/constants/mockData";
import { useAuth } from "@/hooks/useAuth";
import { propertyService } from "@/services/propertyService";
import { toast } from "sonner";

const STEPS = [
    { num: 1, label: "Property Type" },
    { num: 2, label: "Location" },
    { num: 3, label: "Details" },
    { num: 4, label: "Pricing" },
    { num: 5, label: "Amenities" },
    { num: 6, label: "Review" },
];

const AMENITIES_LIST = [
    "Swimming Pool", "Gym", "Garden", "Parking", "Maid Room", "Driver Room",
    "Home Cinema", "Smart Home", "Solar Panels", "EV Charging", "Security System", "Backup Generator",
];

export default function ListProperty() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        type: "", status: "for-sale", city: "", district: "", address: "",
        title: "", description: "", bedrooms: "", bathrooms: "", area: "", parking: "", yearBuilt: "",
        price: "", currency: "SAR", amenities: [] as string[],
    });

    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
    const toggleAmenity = (a: string) => setForm((f) => ({
        ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));

    const handleSubmit = async () => {
        setSubmitting(true);
        const res = await propertyService.create(
            {
                title: form.title || "عقار جديد",
                description: form.description || "",
                type: (form.type as any) || "apartment",
                status: (form.status as any) || "for-sale",
                price: Number(form.price) || 1000000,
                currency: form.currency || "SAR",
                city: form.city || "Riyadh",
                district: form.district || "",
                address: form.address || "",
                bedrooms: Number(form.bedrooms) || 3,
                bathrooms: Number(form.bathrooms) || 2,
                area: Number(form.area) || 180,
                parking: Number(form.parking) || 1,
                yearBuilt: Number(form.yearBuilt) || new Date().getFullYear(),
                images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"],
                features: [],
                amenities: form.amenities,
                featured: false,
            },
            user?.id
        );

        setSubmitting(false);
        if (res.success) {
            toast.success("تم نشر العقار بنجاح في Supabase!", {
                description: "العقار الآن معروض ومتاح لتصفح الزوار والعملاء.",
            });
            navigate("/dashboard");
        } else {
            toast.error("حدث خطأ أثناء حفظ العقار: " + res.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212]">
            <Header />
            <div className="pt-16">
                <div className="border-b border-[#2C2C2E] bg-[#1E1E1E]/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
                        <h1 className="text-white text-3xl font-bold mb-2">List a Property</h1>
                        <p className="text-[#98989D] text-sm">Reach thousands of qualified buyers and renters.</p>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
                    {/* Progress */}
                    <div className="flex items-center gap-1 mb-10 overflow-x-auto scrollbar-hide pb-2">
                        {STEPS.map((s, i) => (
                            <div key={s.num} className="flex items-center gap-1">
                                <button onClick={() => s.num < step && setStep(s.num)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors whitespace-nowrap ${step === s.num ? "bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30"
                                            : step > s.num ? "text-[#32D74B]" : "text-[#98989D]"
                                        }`}>
                                    {step > s.num ? <CheckCircle size={12} /> : <span className="font-mono">{s.num}</span>}
                                    {s.label}
                                </button>
                                {i < STEPS.length - 1 && <ChevronRight size={12} className="text-[#2C2C2E] shrink-0" />}
                            </div>
                        ))}
                    </div>

                    <div className="max-w-2xl">
                        {/* Step 1: Type */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-white font-semibold text-xl mb-2">What type of property?</h2>
                                <p className="text-[#98989D] text-sm mb-6">Select the category that best describes your property.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                                    {PROPERTY_TYPES.map((t) => (
                                        <button key={t} onClick={() => set("type", t.toLowerCase())}
                                            className={`py-4 px-4 border rounded-xl text-sm font-medium transition-colors ${form.type === t.toLowerCase() ? "border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]" : "border-[#2C2C2E] text-[#98989D] hover:text-white"
                                                }`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-3 mb-6">
                                    {(["for-sale", "for-rent"] as const).map((s) => (
                                        <button key={s} onClick={() => set("status", s)}
                                            className={`flex-1 py-3 border rounded-xl text-sm font-medium transition-colors ${form.status === s ? "border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]" : "border-[#2C2C2E] text-[#98989D] hover:text-white"
                                                }`}>
                                            {s === "for-sale" ? "For Sale" : "For Rent"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Location */}
                        {step === 2 && (
                            <div>
                                <h2 className="text-white font-semibold text-xl mb-2">Where is the property?</h2>
                                <p className="text-[#98989D] text-sm mb-6">Enter the property location details.</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-[#98989D] mb-1.5 block">City</label>
                                        <select value={form.city} onChange={(e) => set("city", e.target.value)}
                                            className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white focus:border-[#00E5FF]/50 focus:outline-none">
                                            <option value="">Select city</option>
                                            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#98989D] mb-1.5 block">District / Neighborhood</label>
                                        <input value={form.district} onChange={(e) => set("district", e.target.value)} placeholder="e.g. Al Malqa"
                                            className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#98989D] mb-1.5 block">Street Address</label>
                                        <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street name and number"
                                            className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Details */}
                        {step === 3 && (
                            <div>
                                <h2 className="text-white font-semibold text-xl mb-2">Property details</h2>
                                <p className="text-[#98989D] text-sm mb-6">Provide key information about the property.</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-[#98989D] mb-1.5 block">Property Title</label>
                                        <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Contemporary Villa in Al Malqa"
                                            className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#98989D] mb-1.5 block">Description</label>
                                        <textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)}
                                            placeholder="Describe the property in detail..."
                                            className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none resize-none" />
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {[
                                            { key: "bedrooms", label: "Bedrooms" }, { key: "bathrooms", label: "Bathrooms" },
                                            { key: "area", label: "Area (m²)" }, { key: "parking", label: "Parking Spaces" },
                                            { key: "yearBuilt", label: "Year Built" },
                                        ].map(({ key, label }) => (
                                            <div key={key}>
                                                <label className="text-xs text-[#98989D] mb-1.5 block">{label}</label>
                                                <input type="number" value={(form as any)[key]} onChange={(e) => set(key, e.target.value)} placeholder="0"
                                                    className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white focus:border-[#00E5FF]/50 focus:outline-none" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Pricing */}
                        {step === 4 && (
                            <div>
                                <h2 className="text-white font-semibold text-xl mb-2">Pricing</h2>
                                <p className="text-[#98989D] text-sm mb-6">Set your asking price or rental rate.</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-[#98989D] mb-1.5 block">Currency</label>
                                        <div className="flex gap-3">
                                            {["SAR", "AED", "USD"].map((c) => (
                                                <button key={c} onClick={() => set("currency", c)}
                                                    className={`px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${form.currency === c ? "border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]" : "border-[#2C2C2E] text-[#98989D] hover:text-white"
                                                        }`}>
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-[#98989D] mb-1.5 block">
                                            {form.status === "for-rent" ? "Annual Rent" : "Asking Price"} ({form.currency})
                                        </label>
                                        <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)}
                                            placeholder="0"
                                            className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white focus:border-[#00E5FF]/50 focus:outline-none" />
                                    </div>
                                    {form.price && (
                                        <div className="p-4 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl">
                                            <p className="text-[#98989D] text-xs mb-1">Listed price</p>
                                            <p className="text-[#00E5FF] font-mono font-bold text-2xl">
                                                {form.currency} {Number(form.price).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 5: Amenities */}
                        {step === 5 && (
                            <div>
                                <h2 className="text-white font-semibold text-xl mb-2">Amenities & Features</h2>
                                <p className="text-[#98989D] text-sm mb-6">Select all amenities available in this property.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {AMENITIES_LIST.map((a) => (
                                        <button key={a} onClick={() => toggleAmenity(a)}
                                            className={`py-3 px-4 border rounded-xl text-xs font-medium transition-colors text-left ${form.amenities.includes(a) ? "border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]" : "border-[#2C2C2E] text-[#98989D] hover:text-white"
                                                }`}>
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 6: Review */}
                        {step === 6 && (
                            <div>
                                <h2 className="text-white font-semibold text-xl mb-2">Review your listing</h2>
                                <p className="text-[#98989D] text-sm mb-6">Check your details before submitting for review.</p>
                                <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl divide-y divide-[#2C2C2E]">
                                    {[
                                        { label: "Type", value: `${form.type} · ${form.status === "for-sale" ? "For Sale" : "For Rent"}` },
                                        { label: "Location", value: `${form.district}, ${form.city}` },
                                        { label: "Title", value: form.title },
                                        { label: "Price", value: `${form.currency} ${Number(form.price).toLocaleString()}` },
                                        { label: "Beds / Baths", value: `${form.bedrooms} beds · ${form.bathrooms} baths` },
                                        { label: "Area", value: `${form.area} m²` },
                                        { label: "Amenities", value: form.amenities.join(", ") || "None selected" },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex items-start gap-4 px-5 py-4">
                                            <span className="text-[#98989D] text-xs w-24 shrink-0">{label}</span>
                                            <span className="text-white text-xs">{value || "—"}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex items-center gap-3 mt-8">
                            {step > 1 && (
                                <button onClick={() => setStep(step - 1)}
                                    className="px-6 py-3 border border-[#2C2C2E] text-white text-sm rounded-xl hover:border-[#3C3C3E] transition-colors">
                                    Back
                                </button>
                            )}
                            {step < 6 ? (
                                <button onClick={() => setStep(step + 1)}
                                    className="px-8 py-3 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl hover:bg-[#00E5FF]/90 transition-colors">
                                    Continue
                                </button>
                            ) : (
                                <button onClick={handleSubmit}
                                    className="px-8 py-3 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl hover:bg-[#00E5FF]/90 transition-colors">
                                    Submit Listing
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
