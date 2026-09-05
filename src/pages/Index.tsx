import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Shield, Clock, MapPin } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSearch from "@/components/search/HeroSearch";
import PropertyCard from "@/components/property/PropertyCard";
import AgentCard from "@/components/agent/AgentCard";
import { MOCK_PROPERTIES, MOCK_AGENTS, MOCK_LOCATIONS } from "@/constants/mockData";
import heroImg from "@/assets/hero-property.jpg";

const STATS = [
    { value: "1,240+", label: "عقارات متاحة" },
    { value: "380+", label: "وكلاء معتمدون" },
    { value: "4.2 مليار ريال", label: "عقارات مباعة" },
    { value: "8", label: "أسواق مغطاة" },
];

const FEATURES = [
    { icon: Shield, title: "عقارات موثقة", desc: "يتم مراجعة وتوثيق كل عقار يدوياً من قبل فريقنا قبل عرضه." },
    { icon: TrendingUp, title: "ذكاء السوق", desc: "بيانات تسعير حية واتجاهات السوق لمساعدتك على اتخاذ قرارات مدروسة." },
    { icon: Clock, title: "تحديث يومي", desc: "يتم تحديث قاعدة بياناتنا باستمرار لترى دائماً أحدث العقارات المتاحة." },
];

export default function Index() {
    const featured = MOCK_PROPERTIES.filter((p) => p.featured).slice(0, 6);
    const topAgents = MOCK_AGENTS.slice(0, 3);

    return (
        <div className="min-h-screen bg-[#121212]">
            <Header />

            {/* Hero */}
            <section className="relative min-h-screen flex items-end pb-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img src={heroImg} alt="Premium Property" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/60 to-[#121212]/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/80 via-transparent to-transparent" />
                </div>

                <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 w-full pt-32">
                    <div className="max-w-3xl mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#2C2C2E] rounded-full bg-[#1E1E1E]/80 backdrop-blur-sm mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
                            <span className="text-[#98989D] text-xs font-medium uppercase tracking-widest">ابحث عن عقارك القادم</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
                            ابحث عن مكان<br />
                            <span className="text-[#00E5FF]">تشعر فيه وكأنك في بيتك.</span>
                        </h1>
                        <p className="text-[#98989D] text-lg max-w-xl leading-relaxed">
                            عقارات مختارة بعناية في الأماكن التي تهمك، وموثقة من قبل خبراء يفهمون سوق الشرق الأوسط.
                        </p>
                    </div>

                    <HeroSearch />

                    {/* Stats */}
                    <div className="mt-12 flex flex-wrap gap-8">
                        {STATS.map((s) => (
                            <div key={s.label}>
                                <p className="text-white font-mono font-bold text-2xl">{s.value}</p>
                                <p className="text-[#98989D] text-xs mt-1">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Properties */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-[#00E5FF] text-xs font-medium uppercase tracking-widest mb-3">مختارات بعناية</p>
                        <h2 className="text-white text-3xl lg:text-4xl font-bold tracking-tight">عقارات مميزة</h2>
                        <p className="text-[#98989D] text-sm mt-2">عقارات منتقاة تستحق اهتمامك.</p>
                    </div>
                    <Link to="/properties" className="hidden sm:flex items-center gap-2 text-sm text-[#98989D] hover:text-white transition-colors group">
                        عرض جميع العقارات
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Link to="/properties" className="inline-flex items-center gap-2 text-sm text-[#00E5FF]">
                        عرض جميع العقارات <ArrowLeft size={14} />
                    </Link>
                </div>
            </section>

            {/* Why Aqar */}
            <section className="border-y border-[#2C2C2E] bg-[#1E1E1E]/50">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-[#2C2C2E]">
                        {FEATURES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-[#121212] p-10 lg:p-12">
                                <div className="w-10 h-10 border border-[#2C2C2E] rounded-xl flex items-center justify-center mb-6">
                                    <Icon size={18} className="text-[#00E5FF]" />
                                </div>
                                <h3 className="text-white font-semibold text-lg mb-3">{title}</h3>
                                <p className="text-[#98989D] text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Locations */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <p className="text-[#00E5FF] text-xs font-medium uppercase tracking-widest mb-3">أين نعمل</p>
                        <h2 className="text-white text-3xl lg:text-4xl font-bold tracking-tight">أفضل المناطق</h2>
                    </div>
                    <Link to="/locations" className="hidden sm:flex items-center gap-2 text-sm text-[#98989D] hover:text-white group">
                        جميع المناطق <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {MOCK_LOCATIONS.slice(0, 4).map((loc) => (
                        <Link key={loc.id} to={`/locations/${loc.slug}`}
                            className="group relative rounded-2xl overflow-hidden aspect-[3/4] block">
                            <img src={loc.image} alt={loc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-5">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <MapPin size={11} className="text-[#00E5FF]" />
                                    <span className="text-[#98989D] text-xs">{loc.country}</span>
                                </div>
                                <h3 className="text-white font-semibold text-lg">{loc.name}</h3>
                                <p className="text-[#98989D] text-xs mt-1 font-mono">{loc.properties} عقار</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Agents */}
            <section className="bg-[#1E1E1E]/30 border-y border-[#2C2C2E]">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <p className="text-[#00E5FF] text-xs font-medium uppercase tracking-widest mb-3">فريقنا</p>
                            <h2 className="text-white text-3xl lg:text-4xl font-bold tracking-tight">كبار المستشارين</h2>
                            <p className="text-[#98989D] text-sm mt-2">توجيهات خبراء من محترفين يعرفون كل سوق بعمق.</p>
                        </div>
                        <Link to="/agents" className="hidden sm:flex items-center gap-2 text-sm text-[#98989D] hover:text-white group">
                            جميع الوكلاء <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topAgents.map((a) => <AgentCard key={a.id} agent={a} />)}
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24">
                <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-3xl p-12 lg:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative max-w-2xl">
                        <p className="text-[#00E5FF] text-xs font-medium uppercase tracking-widest mb-4">لملاك العقارات</p>
                        <h2 className="text-white text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                            أضف عقارك معنا.
                        </h2>
                        <p className="text-[#98989D] text-base leading-relaxed mb-8">
                            صل لآلاف المشترين والمستأجرين المؤهلين. تضمن عملية إضافة العقارات الموثقة لدينا وصول عقارك إلى عملاء جادين ومفحوصين مسبقاً.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/list-property"
                                className="px-8 py-3.5 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl hover:bg-[#00E5FF]/90 transition-colors">
                                إضافة عقار
                            </Link>
                            <Link to="/agents"
                                className="px-8 py-3.5 border border-[#2C2C2E] text-white text-sm rounded-xl hover:border-[#3C3C3E] transition-colors">
                                تواصل مع وكيل
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
