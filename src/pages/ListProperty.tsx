import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, Loader2, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyImageUploader from "@/components/property/PropertyImageUploader";
import { PROPERTY_TYPES, CITIES } from "@/constants/mockData";
import { useAuth } from "@/hooks/useAuth";
import { propertyService } from "@/services/propertyService";
import { toast } from "sonner";

const STEPS = [
    { num: 1, label: "نوع العقار" },
    { num: 2, label: "الموقع" },
    { num: 3, label: "المواصفات" },
    { num: 4, label: "السعر" },
    { num: 5, label: "المميزات" },
    { num: 6, label: "الصور (Supabase)" },
    { num: 7, label: "المراجعة والنشر" },
];

const AMENITIES_LIST = [
    "مسبح", "نادي رياضي", "حديقة", "مواقف سيارات", "غرفة خادمة", "غرفة سائق",
    "سينما منزلية", "منزل ذكي", "ألواح طاقة شمسية", "شحن سيارات كهربائية", "نظام أمني", "مولد احتياطي",
];

const TYPE_LABELS: Record<string, string> = {
    Villa: "فيلا", Apartment: "شقة", Penthouse: "بنتهاوس", Townhouse: "تاون هاوس", Duplex: "دوبلكس", Commercial: "تجاري"
};

const CITY_LABELS: Record<string, string> = {
    Riyadh: "الرياض", Jeddah: "جدة", Dubai: "دبي", "Abu Dhabi": "أبو ظبي", "Al Khobar": "الخبر", Cairo: "القاهرة", Muscat: "مسقط", "Kuwait City": "مدينة الكويت"
};

export default function ListProperty() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        type: "apartment",
        status: "for-sale",
        city: "Riyadh",
        district: "",
        address: "",
        title: "",
        description: "",
        bedrooms: "3",
        bathrooms: "2",
        area: "180",
        parking: "1",
        yearBuilt: new Date().getFullYear().toString(),
        price: "",
        currency: "SAR",
        amenities: [] as string[],
        images: [] as string[],
    });

    const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
    const toggleAmenity = (a: string) =>
        setForm((f) => ({
            ...f,
            amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
        }));

    const handleSubmit = async () => {
        setSubmitting(true);
        const defaultImages = [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
        ];

        const res = await propertyService.create(
            {
                title: form.title || "عقار فاخر متميز",
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
                images: form.images.length > 0 ? form.images : defaultImages,
                features: [],
                amenities: form.amenities,
                featured: false,
            },
            user?.id
        );

        setSubmitting(false);
        if (res.success) {
            toast.success("تم نشر العقار بنجاح في قاعدة البيانات والتخزين (Supabase)!", {
                description: "العقار الآن معروض ومتاح لتصفح الزوار والعملاء.",
            });
            navigate("/dashboard");
        } else {
            toast.error("حدث خطأ أثناء حفظ العقار: " + res.error);
        }
    };

    return (
        <div className="min-h-screen bg-aqar-base text-start">
            <Header />
            <div className="pt-16">
                <div className="border-b border-aqar-border bg-aqar-surface/30">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={20} className="text-aqar-cyan" />
                            <h1 className="text-aqar-text text-3xl font-bold">إضافة عقار جديد</h1>
                        </div>
                        <p className="text-aqar-muted text-sm">
                            قم بإدخال بيانات العقار ورفع الصور مباشرة إلى مساحة التخزين الخاصة بك مع إمكانية استبدال الصور لاحقاً.
                        </p>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-10">
                    {/* Stepper Progress Bar */}
                    <div className="flex items-center gap-1 mb-10 overflow-x-auto scrollbar-hide pb-2">
                        {STEPS.map((s, i) => (
                            <div key={s.num} className="flex items-center gap-1">
                                <button
                                    onClick={() => s.num < step && setStep(s.num)}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-colors whitespace-nowrap ${
                                        step === s.num
                                            ? "bg-aqar-cyan/10 text-aqar-cyan border border-aqar-cyan/30 font-bold"
                                            : step > s.num
                                            ? "text-[#32D74B] bg-[#32D74B]/5"
                                            : "text-aqar-muted"
                                    }`}
                                >
                                    {step > s.num ? <CheckCircle size={14} /> : <span className="font-mono">{s.num}</span>}
                                    {s.label}
                                </button>
                                {i < STEPS.length - 1 && <ChevronRight size={12} className="text-[#2C2C2E] rotate-180 shrink-0" />}
                            </div>
                        ))}
                    </div>

                    <div className="max-w-2xl">
                        {/* Step 1: Type */}
                        {step === 1 && (
                            <div>
                                <h2 className="text-aqar-text font-bold text-xl mb-2">ما هو نوع العقار؟</h2>
                                <p className="text-aqar-muted text-sm mb-6">اختر نوع العقار والغرض من عرضه.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                                    {PROPERTY_TYPES.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => set("type", t.toLowerCase())}
                                            className={`py-4 px-4 border rounded-xl text-sm font-medium transition-colors ${
                                                form.type === t.toLowerCase()
                                                    ? "border-aqar-cyan bg-aqar-cyan/10 text-aqar-cyan font-bold"
                                                    : "border-aqar-border text-aqar-muted hover:text-aqar-text"
                                            }`}
                                        >
                                            {TYPE_LABELS[t] || t}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-3 mb-6">
                                    {(["for-sale", "for-rent"] as const).map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => set("status", s)}
                                            className={`flex-1 py-3 border rounded-xl text-sm font-medium transition-colors ${
                                                form.status === s
                                                    ? "border-aqar-cyan bg-aqar-cyan/10 text-aqar-cyan font-bold"
                                                    : "border-aqar-border text-aqar-muted hover:text-aqar-text"
                                            }`}
                                        >
                                            {s === "for-sale" ? "للبيع (For Sale)" : "للإيجار (For Rent)"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Location */}
                        {step === 2 && (
                            <div>
                                <h2 className="text-aqar-text font-bold text-xl mb-2">موقع العقار</h2>
                                <p className="text-aqar-muted text-sm mb-6">حدد المدينة والحي لمساعدة الباحثين.</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-aqar-muted mb-1.5 block">المدينة</label>
                                        <select
                                            value={form.city}
                                            onChange={(e) => set("city", e.target.value)}
                                            className="w-full px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                        >
                                            {CITIES.map((c) => (
                                                <option key={c} value={c}>
                                                    {CITY_LABELS[c] || c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-aqar-muted mb-1.5 block">الحي</label>
                                        <input
                                            value={form.district}
                                            onChange={(e) => set("district", e.target.value)}
                                            placeholder="مثال: الملقا، النرجس، حي الكورنيش..."
                                            className="w-full px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-aqar-muted mb-1.5 block">العنوان التفصيلي</label>
                                        <input
                                            value={form.address}
                                            onChange={(e) => set("address", e.target.value)}
                                            placeholder="الشارع أو المعلم القريب"
                                            className="w-full px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Details */}
                        {step === 3 && (
                            <div>
                                <h2 className="text-aqar-text font-bold text-xl mb-2">تفاصيل ومواصفات العقار</h2>
                                <p className="text-aqar-muted text-sm mb-6">اكتب عنواناً جذاباً ومواصفات دقيقة.</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-aqar-muted mb-1.5 block">عنوان الإعلان</label>
                                        <input
                                            value={form.title}
                                            onChange={(e) => set("title", e.target.value)}
                                            placeholder="مثال: فيلا مودرن فاخرة مع مسبح خاص وحديقة"
                                            className="w-full px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-aqar-muted mb-1.5 block">الوصف التفصيلي</label>
                                        <textarea
                                            rows={4}
                                            value={form.description}
                                            onChange={(e) => set("description", e.target.value)}
                                            placeholder="صف مميزات العقار، التشطيبات، والإطلالة..."
                                            className="w-full px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="text-xs text-aqar-muted mb-1.5 block">غرف النوم</label>
                                            <input
                                                type="number"
                                                value={form.bedrooms}
                                                onChange={(e) => set("bedrooms", e.target.value)}
                                                className="w-full px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-aqar-muted mb-1.5 block">دورات المياه</label>
                                            <input
                                                type="number"
                                                value={form.bathrooms}
                                                onChange={(e) => set("bathrooms", e.target.value)}
                                                className="w-full px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-aqar-muted mb-1.5 block">المساحة (م²)</label>
                                            <input
                                                type="number"
                                                value={form.area}
                                                onChange={(e) => set("area", e.target.value)}
                                                className="w-full px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-aqar-muted mb-1.5 block">مواقف السيارات</label>
                                            <input
                                                type="number"
                                                value={form.parking}
                                                onChange={(e) => set("parking", e.target.value)}
                                                className="w-full px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Pricing */}
                        {step === 4 && (
                            <div>
                                <h2 className="text-aqar-text font-bold text-xl mb-2">السعر ونوع العملة</h2>
                                <p className="text-aqar-muted text-sm mb-6">حدد القيمة السعرية المناسبة للعقار.</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-aqar-muted mb-1.5 block">العملة</label>
                                        <div className="flex gap-3">
                                            {["SAR", "AED", "EGP", "USD"].map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => set("currency", c)}
                                                    className={`px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${
                                                        form.currency === c
                                                            ? "border-aqar-cyan bg-aqar-cyan/10 text-aqar-cyan font-bold"
                                                            : "border-aqar-border text-aqar-muted hover:text-aqar-text"
                                                    }`}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-aqar-muted mb-1.5 block">
                                            {form.status === "for-rent" ? "قيمة الإيجار السنوي" : "سعر البيع المطلوب"} ({form.currency})
                                        </label>
                                        <input
                                            type="number"
                                            value={form.price}
                                            onChange={(e) => set("price", e.target.value)}
                                            placeholder="0"
                                            className="w-full px-4 py-3 bg-aqar-surface border border-aqar-border rounded-xl text-sm text-aqar-text focus:border-aqar-cyan/50 focus:outline-none"
                                        />
                                    </div>
                                    {form.price && (
                                        <div className="p-4 bg-aqar-surface border border-aqar-border rounded-xl">
                                            <p className="text-aqar-muted text-xs mb-1">السعر المعروض:</p>
                                            <p className="text-aqar-cyan font-mono font-bold text-2xl">
                                                {Number(form.price).toLocaleString()} {form.currency}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 5: Amenities */}
                        {step === 5 && (
                            <div>
                                <h2 className="text-aqar-text font-bold text-xl mb-2">المميزات والخدمات</h2>
                                <p className="text-aqar-muted text-sm mb-6">حدد جميع وسائل الراحة المتاحة في هذا العقار.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {AMENITIES_LIST.map((a) => (
                                        <button
                                            key={a}
                                            onClick={() => toggleAmenity(a)}
                                            className={`py-3 px-4 border rounded-xl text-xs font-medium transition-colors text-start ${
                                                form.amenities.includes(a)
                                                    ? "border-aqar-cyan bg-aqar-cyan/10 text-aqar-cyan font-bold"
                                                    : "border-aqar-border text-aqar-muted hover:text-aqar-text"
                                            }`}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 6: Images (Supabase Storage) */}
                        {step === 6 && (
                            <div>
                                <h2 className="text-aqar-text font-bold text-xl mb-2">صور العقار (سحابة Supabase)</h2>
                                <p className="text-aqar-muted text-sm mb-6">
                                    ارفع صور العقار هنا. عند استبدال أي صورة، يتم حذف القديمة نهائياً من التخزين لتوفير المساحة وتجنب التكرار.
                                </p>
                                <PropertyImageUploader
                                    images={form.images}
                                    onChange={(newImages) => setForm((f) => ({ ...f, images: newImages }))}
                                    maxImages={10}
                                />
                            </div>
                        )}

                        {/* Step 7: Review & Submit */}
                        {step === 7 && (
                            <div>
                                <h2 className="text-aqar-text font-bold text-xl mb-2">مراجعة ونشر العقار</h2>
                                <p className="text-aqar-muted text-sm mb-6">تأكد من صحة البيانات قبل حفظها ونشرها في الموقع.</p>
                                <div className="bg-aqar-surface border border-aqar-border rounded-2xl divide-y divide-[#2C2C2E] overflow-hidden mb-6">
                                    {[
                                        { label: "نوع العقار", value: `${TYPE_LABELS[form.type.charAt(0).toUpperCase() + form.type.slice(1)] || form.type} · ${form.status === "for-sale" ? "للبيع" : "للإيجار"}` },
                                        { label: "الموقع", value: `${form.district || "—"}، ${CITY_LABELS[form.city] || form.city}` },
                                        { label: "عنوان الإعلان", value: form.title || "—" },
                                        { label: "السعر", value: `${Number(form.price || 0).toLocaleString()} ${form.currency}` },
                                        { label: "الغرف والدورات", value: `${form.bedrooms} غرف · ${form.bathrooms} دورات مياه` },
                                        { label: "المساحة", value: `${form.area} م²` },
                                        { label: "عدد الصور المرفوعة", value: `${form.images.length} صورة` },
                                        { label: "المميزات", value: form.amenities.join("، ") || "لا توجد" },
                                    ].map(({ label, value }) => (
                                        <div key={label} className="flex items-start justify-between gap-4 px-5 py-4 text-xs">
                                            <span className="text-aqar-muted font-medium shrink-0">{label}</span>
                                            <span className="text-aqar-text font-semibold">{value}</span>
                                        </div>
                                    ))}
                                </div>

                                {form.images.length > 0 ? (
                                    <div className="mb-6">
                                        <p className="text-xs text-aqar-muted mb-3">معاينة صور العقار المرفوعة:</p>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {form.images.map((url, i) => (
                                                <img
                                                    key={i}
                                                    src={url}
                                                    alt={`صورة ${i + 1}`}
                                                    className="w-20 h-16 rounded-lg object-cover border border-aqar-border"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400">
                                        ⚠️ لم ترفع صوراً خاصة، سيتم استخدام صور افتراضية عالية الدقة للعقار. يمكنك العودة للخطوة السابقة لرفع صور حقيقية.
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-3 mt-8">
                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(step - 1)}
                                    className="px-6 py-3 border border-aqar-border text-aqar-text text-sm rounded-xl hover:border-[#3C3C3E] transition-colors"
                                >
                                    السابق
                                </button>
                            )}

                            {step < 7 ? (
                                <button
                                    type="button"
                                    onClick={() => setStep(step + 1)}
                                    className="px-8 py-3 bg-aqar-cyan hover:bg-aqar-cyan/90 text-[#121212] font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#00E5FF]/10"
                                >
                                    التالي
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="px-8 py-3 bg-aqar-cyan hover:bg-aqar-cyan/90 text-[#121212] font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#00E5FF]/10 disabled:opacity-60 flex items-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> جارٍ الحفظ والنشر...
                                        </>
                                    ) : (
                                        "نشر العقار الآن 🚀"
                                    )}
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
