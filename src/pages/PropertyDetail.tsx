import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, ArrowLeftRight, Share2, BedDouble, Bath, Square, Car, Calendar, BadgeCheck, MapPin, Phone, Mail, ChevronLeft, ChevronRight, X, Eye } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { useProperty, useSimilarProperties, useAgent } from "@/hooks/useRealData";
import { formatPrice } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { compareStorage, inquiriesStorage } from "@/lib/storage";
import { leadService } from "@/services/leadService";
import { toast } from "sonner";

export default function PropertyDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { data: property, isLoading: loadingProperty } = useProperty(slug || "");
    const { data: agent } = useAgent(property?.agent || "");
    const { data: similar = [] } = useSimilarProperties(property?.location.city || "", slug || "");
    const { toggle, isFavorite } = useFavorites();
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [activeImg, setActiveImg] = useState(0);
    const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    if (loadingProperty) {
        return (
            <div className="min-h-screen bg-aqar-base flex flex-col items-center justify-center">
                <Header />
                <div className="mt-24 w-8 h-8 border-4 border-aqar-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-aqar-base flex flex-col items-center justify-center">
                <Header />
                <p className="text-aqar-text text-lg mt-24">العقار غير موجود.</p>
                <button onClick={() => navigate("/properties")} className="mt-4 text-aqar-cyan text-sm">← العودة إلى العقارات</button>
            </div>
        );
    }

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
        <div className="min-h-screen bg-aqar-base">
            <Header />

            <div className="pt-16">
                {/* Gallery */}
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-8">
                    <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-aqar-muted hover:text-aqar-text mb-6 transition-colors">
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
                                            <span className="text-aqar-text font-semibold text-sm">+{property.images.length - 4} صور أخرى</span>
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
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${property.status === "for-sale" ? "bg-aqar-cyan text-[#121212]" : "bg-[#32D74B] text-[#121212]"}`}>
                                            {property.status === "for-sale" ? "للبيع" : "للإيجار"}
                                        </span>
                                        {property.verified && (
                                            <div className="flex items-center gap-1.5 text-aqar-cyan text-xs">
                                                <BadgeCheck size={13} /> <span>عقار موثق</span>
                                            </div>
                                        )}
                                        <span className="text-aqar-muted text-xs font-mono">{property.propertyId}</span>
                                    </div>
                                    <h1 className="text-aqar-text text-2xl lg:text-3xl font-bold tracking-tight mb-2">{property.title}</h1>
                                    <div className="flex items-center gap-1.5 text-aqar-muted text-sm">
                                        <MapPin size={13} />
                                        <span>{property.location.address}، {property.location.district}، {property.location.city}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <button onClick={handleFavorite}
                                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-colors ${fav ? "border-[#FF453A] bg-[#FF453A]/10 text-[#FF453A]" : "border-aqar-border text-aqar-muted hover:text-aqar-text"}`}>
                                        <Heart size={16} fill={fav ? "currentColor" : "none"} />
                                    </button>
                                    <button onClick={handleCompare}
                                        className="w-10 h-10 rounded-xl border border-aqar-border text-aqar-muted hover:text-aqar-text flex items-center justify-center transition-colors">
                                        <ArrowLeftRight size={16} />
                                    </button>
                                    <button className="w-10 h-10 rounded-xl border border-aqar-border text-aqar-muted hover:text-aqar-text flex items-center justify-center transition-colors">
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="my-6 p-5 bg-aqar-surface border border-aqar-border rounded-2xl">
                                <p className="text-aqar-muted text-xs mb-1">{property.status === "for-sale" ? "السعر المطلوب" : "الإيجار السنوي"}</p>
                                <p className="font-mono text-aqar-cyan text-4xl font-bold">
                                    {formatPrice(property.price, property.currency)}
                                </p>
                                {property.status === "for-rent" && <p className="text-aqar-muted text-xs mt-1">سنوياً</p>}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                                {[
                                    { icon: BedDouble, label: "غرف النوم", value: property.stats.bedrooms === 0 ? "استوديو" : property.stats.bedrooms },
                                    { icon: Bath, label: "دورات المياه", value: property.stats.bathrooms },
                                    { icon: Square, label: "المساحة الإجمالية", value: `${property.stats.area} م²` },
                                    { icon: Car, label: "مواقف السيارات", value: `${property.stats.parking} مواقف` },
                                ].map(({ icon: Icon, label, value }) => (
                                    <div key={label} className="bg-aqar-surface border border-aqar-border rounded-xl p-4">
                                        <Icon size={16} className="text-aqar-cyan mb-2" />
                                        <p className="text-aqar-text font-mono font-semibold text-lg">{value}</p>
                                        <p className="text-aqar-muted text-xs mt-0.5">{label}</p>
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
                                    <div key={label} className="bg-aqar-surface border border-aqar-border rounded-xl p-4">
                                        <Icon size={14} className="text-aqar-muted mb-2" />
                                        <p className="text-aqar-text font-medium text-sm">{value}</p>
                                        <p className="text-aqar-muted text-xs">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="text-aqar-text font-semibold text-lg mb-4">الوصف</h2>
                                <p className="text-aqar-muted text-sm leading-relaxed">{property.description}</p>
                            </div>

                            {/* Features */}
                            <div className="mb-8">
                                <h2 className="text-aqar-text font-semibold text-lg mb-4">مميزات العقار</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {[...property.features, ...property.amenities].map((f) => (
                                        <div key={f} className="flex items-center gap-2.5 px-3 py-2.5 bg-aqar-surface border border-aqar-border rounded-xl">
                                            <div className="w-1.5 h-1.5 rounded-full bg-aqar-cyan shrink-0" />
                                            <span className="text-aqar-muted text-xs">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Inquiry Form */}
                            <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-6">
                                <h2 className="text-aqar-text font-semibold text-lg mb-5">طلب معلومات</h2>
                                {submitted ? (
                                    <div className="text-center py-8">
                                        <div className="w-12 h-12 bg-[#32D74B]/10 border border-[#32D74B]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <BadgeCheck size={20} className="text-[#32D74B]" />
                                        </div>
                                        <p className="text-aqar-text font-medium">تم إرسال الطلب</p>
                                        <p className="text-aqar-muted text-sm mt-1">سيتواصل معك الوكيل قريباً.</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleInquiry} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-aqar-muted mb-1.5 block">الاسم الكامل</label>
                                                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="اسمك"
                                                    className="w-full px-4 py-3 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text placeholder-[#98989D]/50 focus:border-aqar-cyan/50 focus:outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-aqar-muted mb-1.5 block">رقم الهاتف</label>
                                                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+966 50 000 0000"
                                                    className="w-full px-4 py-3 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text placeholder-[#98989D]/50 focus:border-aqar-cyan/50 focus:outline-none text-left" dir="ltr" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-aqar-muted mb-1.5 block">البريد الإلكتروني</label>
                                            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
                                                className="w-full px-4 py-3 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text placeholder-[#98989D]/50 focus:border-aqar-cyan/50 focus:outline-none text-left" dir="ltr" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-aqar-muted mb-1.5 block">الرسالة</label>
                                            <textarea required rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                placeholder={`أنا مهتم بـ ${property.title}...`}
                                                className="w-full px-4 py-3 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text placeholder-[#98989D]/50 focus:border-aqar-cyan/50 focus:outline-none resize-none" />
                                        </div>
                                        <button type="submit" className="w-full py-3.5 bg-aqar-cyan text-[#121212] font-semibold text-sm rounded-xl hover:bg-aqar-cyan/90 transition-colors">
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
                                    <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-6">
                                        <p className="text-aqar-muted text-xs font-medium uppercase tracking-wider mb-4">بواسطة</p>
                                        <div className="flex items-start gap-3 mb-5">
                                            <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-xl object-cover" />
                                            <div>
                                                <h3 className="text-aqar-text font-semibold text-sm">{agent.name}</h3>
                                                <p className="text-aqar-muted text-xs">{agent.title}</p>
                                                <p className="text-aqar-muted text-xs">{agent?.company || 'Aqar'}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2 mb-5">
                                            <a href={`tel:${agent.phone}`} dir="ltr"
                                                className="flex items-center gap-3 px-4 py-3 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text hover:border-aqar-cyan/40 transition-colors justify-end">
                                                 {agent.phone} <Phone size={14} className="text-aqar-cyan" />
                                            </a>
                                            <a href={`mailto:${agent.email}`} dir="ltr"
                                                className="flex items-center gap-3 px-4 py-3 bg-aqar-base border border-aqar-border rounded-xl text-sm text-aqar-text hover:border-aqar-cyan/40 transition-colors justify-end">
                                                 {agent.email} <Mail size={14} className="text-aqar-cyan" />
                                            </a>
                                        </div>
                                        <Link to={`/agents/${agent.id}`}
                                            className="block w-full py-2.5 border border-aqar-border text-aqar-text text-sm font-medium text-center rounded-xl hover:border-aqar-cyan/40 transition-colors">
                                            عرض الصفحة الشخصية
                                        </Link>
                                    </div>
                                )}

                                {/* Mobile Sticky CTA */}
                                <div className="lg:hidden fixed bottom-0 inset-x-0 p-4 bg-aqar-base/95 backdrop-blur-md border-t border-aqar-border flex gap-3 z-40">
                                    <button onClick={handleFavorite} aria-label="أضف للمفضلة"
                                        className={`w-12 h-12 rounded-xl border flex items-center justify-center ${fav ? "border-[#FF453A] bg-[#FF453A]/10 text-[#FF453A]" : "border-aqar-border text-aqar-muted"}`}>
                                        <Heart size={18} fill={fav ? "currentColor" : "none"} />
                                    </button>
                                    <button className="flex-1 py-3 bg-aqar-cyan text-[#121212] font-semibold text-sm rounded-xl">
                                        تواصل مع الوكيل
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Similar */}
                    {similar.length > 0 && (
                        <div className="mt-16 pb-8">
                            <h2 className="text-aqar-text font-semibold text-xl mb-6">عقارات مشابهة</h2>
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
                        <span className="text-aqar-text text-sm font-mono">{galleryIndex + 1} / {property.images.length}</span>
                        <button onClick={() => setGalleryOpen(false)} className="w-10 h-10 rounded-xl bg-aqar-surface border border-aqar-border flex items-center justify-center text-aqar-text">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center px-4 relative">
                        <button onClick={prevImg} className="absolute start-4 w-10 h-10 rounded-xl bg-aqar-surface border border-aqar-border flex items-center justify-center text-aqar-text z-10">
                            <ChevronRight size={18} />
                        </button>
                        <img src={property.images[galleryIndex]} alt="" className="max-h-full max-w-full object-contain rounded-xl" />
                        <button onClick={nextImg} className="absolute end-4 w-10 h-10 rounded-xl bg-aqar-surface border border-aqar-border flex items-center justify-center text-aqar-text z-10">
                            <ChevronLeft size={18} />
                        </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto px-5 py-4 scrollbar-hide">
                        {property.images.map((img, i) => (
                            <button key={i} onClick={() => setGalleryIndex(i)}
                                className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${galleryIndex === i ? "border-aqar-cyan" : "border-transparent"}`}>
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
