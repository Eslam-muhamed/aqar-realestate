import { Link } from "react-router-dom";
import { CheckCircle, Users, Globe, Award } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const MILESTONES = [
    { year: "2018", title: "تأسست في الرياض", desc: "تم إطلاق عقار مع التركيز على السوق السكني الراقي في الرياض." },
    { year: "2020", title: "توسعت لجدة والإمارات", desc: "زادت التغطية لتشمل جدة ودبي وأبو ظبي." },
    { year: "2022", title: "أكثر من 1000 عقار نشط", desc: "وصلنا إلى إنجاز 1000 عقار موثق على المنصة." },
    { year: "2024", title: "رائد إقليمي", desc: "أصبحت المنصة الأكثر ثقة للعقارات الراقية في جميع أنحاء السعودية." },
];

const VALUES = [
    { icon: CheckCircle, title: "التحقق أولاً", desc: "يتم التحقق يدويًا من كل عقار ومستشار في عقار قبل ظهوره على المنصة." },
    { icon: Users, title: "العميل في المركز", desc: "نقيس النجاح بمدى مطابقة العملاء للعقار المناسب، وليس بحجم المبيعات." },
    { icon: Globe, title: "خبرة إقليمية", desc: "معرفة محلية عميقة في كل سوق نعمل فيه، وليس مجرد نهج عالمي عام." },
    { icon: Award, title: "معايير مهنية", desc: "نلزم مستشارينا بأعلى المعايير المهنية والأخلاقية في الصناعة." },
];

export default function About() {
    return (
        <div className="min-h-screen bg-aqar-base text-right" dir="rtl">
            <Header />
            <div className="pt-16">
                {/* Hero */}
                <div className="border-b border-aqar-border">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                        <p className="text-aqar-cyan text-xs font-medium uppercase tracking-widest mb-4">نبذة عن عقار</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-aqar-text text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                                    المنصة العقارية الراقية لمنطقة الشرق الأوسط وشمال أفريقيا.
                                </h1>
                                <p className="text-aqar-muted text-base leading-relaxed mb-8">
                                    تم بناء عقار لغرض واحد: جعل عملية العثور على العقارات الراقية وتداولها بسيطة وجديرة بالثقة واحترافية. نحن نتحقق من كل قائمة وكل مستشار حتى لا تضطر أبدًا إلى الشك فيما تراه.
                                </p>
                                <div className="flex gap-4">
                                    <Link to="/properties" className="px-6 py-3 bg-aqar-cyan text-[#121212] font-semibold text-sm rounded-xl hover:bg-aqar-cyan/90 transition-colors">
                                        تصفح العقارات
                                    </Link>
                                    <Link to="/agents" className="px-6 py-3 border border-aqar-border text-aqar-text text-sm rounded-xl hover:border-[#3C3C3E] transition-colors">
                                        تعرف على مستشارينا
                                    </Link>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: "1,240+", label: "عقارات نشطة" },
                                    { value: "380+", label: "مستشارين موثقين" },
                                    { value: "8", label: "أسواق" },
                                    { value: "4.2B ر.س", label: "مبيعات عقارية", ltr: true },
                                ].map(({ value, label, ltr }) => (
                                    <div key={label} className="bg-aqar-surface border border-aqar-border rounded-2xl p-6">
                                        <p className="text-aqar-text font-mono font-bold text-3xl mb-1 text-start" dir={ltr ? "ltr" : "auto"}>{value}</p>
                                        <p className="text-aqar-muted text-sm text-start">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                    <h2 className="text-aqar-text text-2xl font-bold mb-10 text-start">قيمنا</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-aqar-surface border border-aqar-border rounded-2xl p-6">
                                <div className="w-10 h-10 border border-aqar-border rounded-xl flex items-center justify-center mb-5">
                                    <Icon size={18} className="text-aqar-cyan" />
                                </div>
                                <h3 className="text-aqar-text font-semibold text-sm mb-2 text-start">{title}</h3>
                                <p className="text-aqar-muted text-xs leading-relaxed text-start">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="border-t border-aqar-border">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                        <h2 className="text-aqar-text text-2xl font-bold mb-10 text-start">رحلتنا</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {MILESTONES.map(({ year, title, desc }) => (
                                <div key={year} className="relative ps-6 border-s-2 border-aqar-border">
                                    <div className="absolute start-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-aqar-cyan" />
                                    <p className="text-aqar-cyan font-mono text-sm font-semibold mb-2 text-start" dir="ltr">{year}</p>
                                    <h3 className="text-aqar-text font-semibold text-sm mb-2 text-start">{title}</h3>
                                    <p className="text-aqar-muted text-xs leading-relaxed text-start">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
