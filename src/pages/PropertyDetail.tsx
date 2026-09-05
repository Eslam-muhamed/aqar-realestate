import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeftRight, Share2, BedDouble, Bath, Square, Car, Calendar, BadgeCheck, MapPin, Phone, Mail, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { MOCK_PROPERTIES, MOCK_AGENTS } from "@/constants/mockData";
import { formatPrice } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { compareStorage, inquiriesStorage } from "@/lib/storage";
import { leadService } from "@/services/leadService";
import { toast } from "sonner";

export default function PropertyDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const property = MOCK_PROPERTIES.find((p) => p.slug === slug);
    const { toggle, isFavorite } = useFavorites();
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [activeImg, setActiveImg] = useState(0);
    const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    if (!property) {
        return (
            <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center">
                <Header />
                <p className="text-white text-lg mt-24">العقار غير موجود.</p>
                <button onClick={() => navigate("/properties")} className="mt-4 text-[#00E5FF] text-sm">← العودة إلى العقارات</button>
            </div>
        );
    }

    const agent = MOCK_AGENTS.find((a) => a.id === property.agent);
    const similar = MOCK_PROPERTIES.filter((p) => p.id !== property.id && p.location.city === property.location.city).slice(0, 3);
    const fav = isFavorite(property.id);

    const handleFavorite = () => {
        const added = toggle(property.id);
        toast(added ? "تم الحفظ في المفضلة" : "تمت الإزالة من المفضلة");
    };

    const handleCompare = () => {
        const success = compareStorage.add(property.id);
        if (success) toast.success("تمت الإضافة للمقارنة");
        else toast.error("لا يمكن الإضافة — تم الوصول للحد الأقصى أو مضاف مسبقاً.");
    };

    const handleInquiry = async (e: React.FormEvent) => {
        e.preventDefault();
        await leadService.createLead({
            property_id: property.id,
            property_title: property.title,
            client_name: form.name,
            client_phone: form.phone,
            client_email: form.email,
            message: form.message,
            source: "property_detail_page",
        });
        setSubmitted(true);
        toast.success("تم إرسال استفسارك بنجاح! سيتم التواصل معك قريباً.");
    };

    const prevImg = () => setGalleryIndex((i) => (i - 1 + property.images.length) % property.images.length);
    const nextImg = () => setGalleryIndex((i) => (i + 1) % property.images.length);

    return (
        <div className="min-h-screen bg-[#121212]">
            <Header />

            <div className="pt-16">
                {/* Gallery */}
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-8">
                    <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-[#98989D] hover:text-white mb-6 transition-colors">
                        <ChevronRight size={14} /> العودة إلى العقارات
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 rounded-2xl overflow-hidden mb-8" style={{ height: "480px" }}>
                        <div className="lg:col-span-2 cursor-pointer overflow-hidden" onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }}>
                            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
                        </div>
                        <div className="hidden lg:grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`overflow-hidden cursor-pointer relative ${i === 4 ? "relative" : ""}`}
                                    onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }}>
                                    <img src={property.images[i] || property.images[0]} alt="" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500" />
                                    {i === 4 && property.images.length > 4 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">+{property.images.length - 4} صور أخرى</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Layout */}
                    <div className="flex flex-col lg:flex-row gap-10">
                        {/* Main */}
                        <div className="flex-1 min-w-0">
                            {/* Title Block */}
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${property.status === "for-sale" ? "bg-[#00E5FF] text-[#121212]" : "bg-[#32D74B] text-[#121212]"}`}>
                                            {property.status === "for-sale" ? "للبيع" : "للإيجار"}
                                        </span>
                                        {property.verified && (
                                            <div className="flex items-center gap-1.5 text-[#00E5FF] text-xs">
                                                <BadgeCheck size={13} /> <span>عقار موثق</span>
                                            </div>
                                        )}
                                        <span className="text-[#98989D] text-xs font-mono">{property.propertyId}</span>
                                    </div>
                                    <h1 className="text-white text-2xl lg:text-3xl font-bold tracking-tight mb-2">{property.title}</h1>
                                    <div className="flex items-center gap-1.5 text-[#98989D] text-sm">
                                        <MapPin size={13} />
                                        <span>{property.location.address}، {property.location.district}، {property.location.city}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={handleFavorite}
                                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${fav ? "border-[#FF453A] bg-[#FF453A]/10 text-[#FF453A]" : "border-[#2C2C2E] text-[#98989D] hover:text-white"}`}>
                                        <Heart size={16} fill={fav ? "currentColor" : "none"} />
                                    </button>
                                    <button onClick={handleCompare}
                                        className="w-10 h-10 rounded-xl border border-[#2C2C2E] text-[#98989D] hover:text-white flex items-center justify-center transition-colors">
                                        <ArrowLeftRight size={16} />
                                    </button>
                                    <button className="w-10 h-10 rounded-xl border border-[#2C2C2E] text-[#98989D] hover:text-white flex items-center justify-center transition-colors">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="my-6 p-5 bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl">
                                <p className="text-[#98989D] text-xs mb-1">{property.status === "for-sale" ? "السعر المطلوب" : "الإيجار السنوي"}</p>
                                <p className="font-mono text-[#00E5FF] text-4xl font-bold">
                                    {formatPrice(property.price, property.currency)}
                                </p>
                                {property.status === "for-rent" && <p className="text-[#98989D] text-xs mt-1">سنوياً</p>}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                                {[
                                    { icon: BedDouble, label: "غرف النوم", value: property.stats.bedrooms === 0 ? "استوديو" : property.stats.bedrooms },
                                    { icon: Bath, label: "دورات المياه", value: property.stats.bathrooms },
                                    { icon: Square, label: "المساحة الإجمالية", value: `${property.stats.area} م²` },
                                    { icon: Car, label: "مواقف السيارات", value: `${property.stats.parking} مواقف` },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl p-4">
                                        <Icon size={16} className="text-[#00E5FF] mb-2" />
                                        <p className="text-white font-mono font-semibold text-lg">{value}</p>
                                        <p className="text-[#98989D] text-xs mt-0.5">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Additional Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                                {[
                                    { icon: Calendar, label: "سنة البناء", value: property.stats.yearBuilt },
                                    { icon: Eye, label: "المشاهدات", value: property.views.toLocaleString() },
                                    { label: "النوع", value: property.type.charAt(0).toUpperCase() + property.type.slice(1), icon: BadgeCheck },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl p-4">
                                        <Icon size={14} className="text-[#98989D] mb-2" />
                                        <p className="text-white font-medium text-sm">{value}</p>
                                        <p className="text-[#98989D] text-xs">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="text-white font-semibold text-lg mb-4">الوصف</h2>
                                <p className="text-[#98989D] text-sm leading-relaxed">{property.description}</p>
                            </div>

                            {/* Features */}
                            <div className="mb-8">
                                <h2 className="text-white font-semibold text-lg mb-4">مميزات العقار</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {[...property.features, ...property.amenities].map((f) => (
                                        <div key={f} className="flex items-center gap-2.5 px-3 py-2.5 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shrink-0" />
                                            <span className="text-[#98989D] text-xs">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Inquiry Form */}
                            <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-6">
                                <h2 className="text-white font-semibold text-lg mb-5">طلب معلومات</h2>
                                {submitted ? (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-[#32D74B]/10 border border-[#32D74B]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <BadgeCheck size={20} className="text-[#32D74B]" />
                                        </div>
                                        <p className="text-white font-medium">تم إرسال الطلب</p>
                                        <p className="text-[#98989D] text-sm mt-1">سيتواصل معك الوكيل قريباً.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleInquiry} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-[#98989D] mb-1.5 block">الاسم الكامل</label>
                                                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسمك"
                                                    className="w-full px-4 py-3 bg-[#121212] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-[#98989D] mb-1.5 block">رقم الهاتف</label>
                                                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+966 50 000 0000"
                                                    className="w-full px-4 py-3 bg-[#121212] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none text-left" dir="ltr" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-[#98989D] mb-1.5 block">البريد الإلكتروني</label>
                                            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
                                                className="w-full px-4 py-3 bg-[#121212] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none text-left" dir="ltr" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-[#98989D] mb-1.5 block">الرسالة</label>
                                            <textarea required rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                placeholder={`أنا مهتم بـ ${property.title}...`}
                                                className="w-full px-4 py-3 bg-[#121212] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none resize-none" />
                                        </div>
                                        <button type="submit" className="w-full py-3.5 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl hover:bg-[#00E5FF]/90 transition-colors">
                                            إرسال الطلب
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-4">
                            {/* Sticky container */}
                            <div className="lg:sticky lg:top-24 space-y-4">
                                {/* Agent Card */}
                                {agent && (
                                    <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-6">
                                        <p className="text-[#98989D] text-xs font-medium uppercase tracking-wider mb-4">بواسطة</p>
                                        <div className="flex items-start gap-3 mb-5">
                                            <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-xl object-cover" />
                                            <div>
                                                <h3 className="text-white font-semibold text-sm">{agent.name}</h3>
                                                <p className="text-[#98989D] text-xs">{agent.title}</p>
                                                <p className="text-[#98989D] text-xs">{agent.company}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-5">
                                            <a href={`tel:${agent.phone}`} dir="ltr"
                                                className="flex items-center gap-3 px-4 py-3 bg-[#121212] border border-[#2C2C2E] rounded-xl text-sm text-white hover:border-[#00E5FF]/40 transition-colors justify-end">
                                                 {agent.phone} <Phone size={14} className="text-[#00E5FF]" />
                                            </a>
                                            <a href={`mailto:${agent.email}`} dir="ltr"
                                                className="flex items-center gap-3 px-4 py-3 bg-[#121212] border border-[#2C2C2E] rounded-xl text-sm text-white hover:border-[#00E5FF]/40 transition-colors justify-end">
                                                 {agent.email} <Mail size={14} className="text-[#00E5FF]" />
                                            </a>
                                        </div>
                                        <Link to={`/agents/${agent.id}`}
                                            className="block w-full py-2.5 border border-[#2C2C2E] text-white text-sm font-medium text-center rounded-xl hover:border-[#00E5FF]/40 transition-colors">
                                            عرض الصفحة الشخصية
                                        </Link>
                                    </div>
                                )}

                                {/* Mobile Sticky CTA */}
                                <div className="lg:hidden fixed bottom-0 inset-x-0 p-4 bg-[#121212]/95 backdrop-blur-md border-t border-[#2C2C2E] flex gap-3 z-40">
                                    <button onClick={handleFavorite}
                                        className={`w-12 h-12 rounded-xl border flex items-center justify-center ${fav ? "border-[#FF453A] bg-[#FF453A]/10 text-[#FF453A]" : "border-[#2C2C2E] text-[#98989D]"}`}>
                                        <Heart size={18} fill={fav ? "currentColor" : "none"} />
                                    </button>
                                    <button className="flex-1 py-3 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl">
                                        تواصل مع الوكيل
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar */}
                    {similar.length > 0 && (
                        <div className="mt-16 pb-8">
                            <h2 className="text-white font-semibold text-xl mb-6">عقارات مشابهة</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Fullscreen Gallery */}
            {galleryOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
                    <div className="flex items-center justify-between p-5">
                        <span className="text-white text-sm font-mono">{galleryIndex + 1} / {property.images.length}</span>
                        <button onClick={() => setGalleryOpen(false)} className="w-10 h-10 rounded-xl bg-[#1E1E1E] border border-[#2C2C2E] flex items-center justify-center text-white">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-4 relative">
                        <button onClick={prevImg} className="absolute start-4 w-10 h-10 rounded-xl bg-[#1E1E1E] border border-[#2C2C2E] flex items-center justify-center text-white z-10">
                            <ChevronRight size={18} />
                        </button>
                        <img src={property.images[galleryIndex]} alt="" className="max-h-full max-w-full object-contain rounded-xl" />
                        <button onClick={nextImg} className="absolute end-4 w-10 h-10 rounded-xl bg-[#1E1E1E] border border-[#2C2C2E] flex items-center justify-center text-white z-10">
                            <ChevronLeft size={18} />
                        </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto px-5 py-4 scrollbar-hide">
                        {property.images.map((img, i) => (
                            <button key={i} onClick={() => setGalleryIndex(i)}
                                className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${galleryIndex === i ? "border-[#00E5FF]" : "border-transparent"}`}>
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
