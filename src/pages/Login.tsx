import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, ShieldCheck, UserCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
    email: z.string().email({ message: "البريد الإلكتروني غير صالح" }),
    password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setError("");
        setLoading(true);

        const result = await login(data.email, data.password);
        setLoading(false);
        if (result.success) {
            toast.success("تم تسجيل الدخول بنجاح");
            navigate("/dashboard");
        } else {
            setError(result.error || "فشل تسجيل الدخول. تأكد من صحة البيانات.");
        }
    };

    const handleQuickLogin = async (email: string, pass: string, roleName: string) => {
        setValue("email", email);
        setValue("password", pass);
        setLoading(true);
        setError("");
        const result = await login(email, pass);
        setLoading(false);
        if (result.success) {
            toast.success(`مرحباً بك! تم الدخول كـ ${roleName}`);
            navigate("/dashboard");
        } else {
            setError(result.error || "فشل الدخول السريع.");
        }
    };

    return (
        <div className="min-h-screen bg-aqar-base flex  text-start">
            {/* Left/Image panel */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200&q=80"
                    alt="Property"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/70 to-transparent" />
                <div className="relative z-10 flex flex-col justify-end p-12 w-full">
                    <div className="max-w-md">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-9 h-9 bg-aqar-cyan rounded-xl flex items-center justify-center shadow-lg shadow-[#00E5FF]/20">
                                <span className="text-[#121212] font-black text-sm">عقار</span>
                            </div>
                            <span className="text-aqar-text font-bold text-xl">نظام إدارة العقارات والمشرفين</span>
                        </div>
                        <blockquote className="text-aqar-text text-2xl font-bold leading-relaxed mb-4">
                            "نظام آمن يتيح للمكتب إدارة العقارات وتوزيع العملاء بدقة لمنع أي تعارض بين المشرفين."
                        </blockquote>
                        <p className="text-aqar-muted text-sm">منصة عقار المتطورة — مدعومة بقواعد بيانات Supabase</p>
                    </div>
                </div>
            </div>

            {/* Right/Form panel */}
            <div className="w-full lg:w-[500px] flex flex-col justify-center px-8 lg:px-14 py-12">
                <div className="max-w-sm mx-auto w-full">
                    <Link to="/" className="flex items-center gap-2 mb-10">
                        <div className="w-8 h-8 bg-aqar-cyan rounded-xl flex items-center justify-center">
                            <span className="text-[#121212] font-bold text-xs">عقار</span>
                        </div>
                        <span className="text-aqar-text font-bold text-lg">منصة عقار</span>
                    </Link>

                    <h1 className="text-aqar-text text-2xl font-bold mb-2">تسجيل دخول فريق العمل</h1>
                    <p className="text-aqar-muted text-xs mb-6">
                        سجل دخولك كمدير للمكتب (Admin) أو كمشرف (Supervisor) لمتابعة العملاء المكلف بهم.
                    </p>

                    {error && (
                        <div className="flex items-center gap-2 p-3.5 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl mb-5 text-start">
                            <AlertCircle size={16} className="text-[#FF453A] shrink-0" />
                            <p className="text-[#FF453A] text-xs font-medium leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="text-xs text-aqar-muted mb-1.5 block">البريد الإلكتروني</label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="name@aqar.com"
                                className={`w-full px-4 py-3 bg-aqar-surface border ${errors.email ? 'border-[#FF453A]' : 'border-aqar-border'} rounded-xl text-sm text-aqar-text placeholder-[#98989D]/40 focus:border-aqar-cyan/50 focus:outline-none`}
                            />
                            {errors.email && <p className="text-[#FF453A] text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs text-aqar-muted mb-1.5 block">كلمة المرور</label>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type={showPass ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-3 ps-10 bg-aqar-surface border ${errors.password ? 'border-[#FF453A]' : 'border-aqar-border'} rounded-xl text-sm text-aqar-text placeholder-[#98989D]/40 focus:border-aqar-cyan/50 focus:outline-none`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute start-3 top-1/2 -translate-y-1/2 text-aqar-muted hover:text-aqar-text"
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-[#FF453A] text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-aqar-cyan hover:bg-aqar-cyan/90 text-[#121212] font-bold text-sm rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#00E5FF]/10"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : "تسجيل الدخول"}
                        </button>
                    </form>

                    {/* Quick Access / Demo Accounts */}
                    <div className="mt-8 pt-6 border-t border-aqar-border">
                        <p className="text-xs text-aqar-muted mb-3 font-semibold">الدخول السريع لتجربة الصلاحيات وتوزيع الـ Leads:</p>
                        <div className="space-y-2">
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("admin@aqar.com", "password123", "مدير المكتب (Admin)")}
                                className="w-full px-3.5 py-2.5 bg-aqar-surface hover:bg-[#2C2C2E] border border-amber-500/30 rounded-xl text-xs font-semibold text-amber-400 flex items-center justify-between transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <ShieldCheck size={16} /> دخول كـ مدير المكتب (Admin)
                                </span>
                                <span className="text-[10px] text-aqar-muted">كامل الصلاحيات وتوزيع الـ Leads</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickLogin("ahmed@aqar.com", "password123", "مشرف المبيعات 1 (أحمد)")}
                                className="w-full px-3.5 py-2.5 bg-aqar-surface hover:bg-[#2C2C2E] border border-cyan-500/30 rounded-xl text-xs font-semibold text-cyan-400 flex items-center justify-between transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <UserCheck size={16} /> دخول كـ مشرف 1 (أحمد)
                                </span>
                                <span className="text-[10px] text-aqar-muted">يرى فقط الـ Leads المكلف بها</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleQuickLogin("sara@aqar.com", "password123", "مشرفة العقارات 2 (سارة)")}
                                className="w-full px-3.5 py-2.5 bg-aqar-surface hover:bg-[#2C2C2E] border border-purple-500/30 rounded-xl text-xs font-semibold text-purple-400 flex items-center justify-between transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <UserCheck size={16} /> دخول كـ مشرفة 2 (سارة)
                                </span>
                                <span className="text-[10px] text-aqar-muted">قفل خاص لعملائها فقط</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
