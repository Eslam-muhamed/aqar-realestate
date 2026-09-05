import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signupSchema = z.object({
    name: z.string().min(2, { message: "الاسم يجب أن يكون حرفين على الأقل" }),
    email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
    password: z.string().min(8, { message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" }),
    confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirm"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupForm) => {
        setError("");
        setLoading(true);
        const result = await signup(data.name, data.email, data.password);
        setLoading(false);
        if (result.success) {
            toast.success("تم إنشاء الحساب بنجاح");
            navigate("/dashboard");
        } else {
            setError(result.error || "فشل إنشاء الحساب.");
        }
    };

    return (
        <div className="min-h-screen bg-aqar-base flex flex-row-reverse text-right" dir="rtl">
            {/* Left */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80" alt="Luxury Property"
                    className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-l from-[#121212]/80 to-black/30" />
                <div className="relative z-10 flex flex-col justify-end p-12">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-7 h-7 bg-aqar-cyan rounded-sm flex items-center justify-center">
                            <span className="text-[#121212] font-bold text-xs font-mono">عقار</span>
                        </div>
                        <span className="text-aqar-text font-semibold text-lg">عقار</span>
                    </div>
                    <h2 className="text-aqar-text text-3xl font-bold max-w-sm">انضم لآلاف الباحثين عن العقارات في منطقة الشرق الأوسط.</h2>
                </div>
            </div>

            {/* Right */}
            <div className="w-full lg:w-[480px] flex flex-col justify-center px-8 lg:px-16">
                <div className="max-w-sm mx-auto w-full">
                    <Link to="/" className="flex items-center gap-2 mb-12 lg:hidden">
                        <div className="w-7 h-7 bg-aqar-cyan rounded-sm flex items-center justify-center">
                            <span className="text-[#121212] font-bold text-xs font-mono">عقار</span>
                        </div>
                        <span className="text-aqar-text font-semibold text-lg">عقار</span>
                    </Link>

                    <h1 className="text-aqar-text text-2xl font-bold mb-2">إنشاء حساب جديد</h1>
                    <p className="text-aqar-muted text-sm mb-8">
                        لديك حساب بالفعل؟ <Link to="/login" className="text-aqar-cyan hover:underline">تسجيل الدخول</Link>
                    </p>

                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl mb-6">
                            <AlertCircle size={14} className="text-[#FF453A] shrink-0" />
                            <p className="text-[#FF453A] text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="text-xs text-aqar-muted mb-1.5 block">الاسم الكامل</label>
                            <input 
                                {...register("name")} 
                                placeholder="اسمك الكامل"
                                className={`w-full px-4 py-3 bg-aqar-surface border ${errors.name ? 'border-[#FF453A]' : 'border-aqar-border'} rounded-xl text-sm text-aqar-text placeholder-[#98989D]/50 focus:border-aqar-cyan/50 focus:outline-none`} 
                            />
                            {errors.name && <p className="text-[#FF453A] text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs text-aqar-muted mb-1.5 block">البريد الإلكتروني</label>
                            <input 
                                {...register("email")} 
                                type="email" 
                                placeholder="you@example.com"
                                className={`w-full px-4 py-3 bg-aqar-surface border ${errors.email ? 'border-[#FF453A]' : 'border-aqar-border'} rounded-xl text-sm text-aqar-text placeholder-[#98989D]/50 focus:border-aqar-cyan/50 focus:outline-none text-left`} dir="ltr" 
                            />
                            {errors.email && <p className="text-[#FF453A] text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs text-aqar-muted mb-1.5 block">كلمة المرور</label>
                            <div className="relative">
                                <input 
                                    {...register("password")} 
                                    type={showPass ? "text" : "password"}
                                    placeholder="8 أحرف كحد أدنى"
                                    className={`w-full px-4 py-3 ps-10 bg-aqar-surface border ${errors.password ? 'border-[#FF453A]' : 'border-aqar-border'} rounded-xl text-sm text-aqar-text placeholder-[#98989D]/50 focus:border-aqar-cyan/50 focus:outline-none`} 
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute start-3 top-1/2 -translate-y-1/2 text-aqar-muted hover:text-aqar-text">
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-[#FF453A] text-xs mt-1">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs text-aqar-muted mb-1.5 block">تأكيد كلمة المرور</label>
                            <input 
                                {...register("confirm")} 
                                type="password"
                                placeholder="إعادة كلمة المرور"
                                className={`w-full px-4 py-3 bg-aqar-surface border ${errors.confirm ? 'border-[#FF453A]' : 'border-aqar-border'} rounded-xl text-sm text-aqar-text placeholder-[#98989D]/50 focus:border-aqar-cyan/50 focus:outline-none`} 
                            />
                            {errors.confirm && <p className="text-[#FF453A] text-xs mt-1">{errors.confirm.message}</p>}
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3.5 bg-aqar-cyan text-[#121212] font-semibold text-sm rounded-xl hover:bg-aqar-cyan/90 transition-colors disabled:opacity-60 mt-2 flex items-center justify-center gap-2">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : "إنشاء الحساب"}
                        </button>
                    </form>

                    <p className="mt-6 text-aqar-muted text-xs leading-relaxed">
                        بإنشائك حساباً، أنت توافق على{" "}
                        <a href="#" className="text-aqar-cyan hover:underline">شروط الخدمة</a> و{" "}
                        <a href="#" className="text-aqar-cyan hover:underline">سياسة الخصوصية</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
