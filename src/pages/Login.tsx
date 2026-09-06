import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
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

    return (
        <div className="min-h-screen bg-aqar-base flex  text-start">
            {/* Left/Image panel */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200&q=80"
                    alt="Property"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                <div className="relative z-10 flex flex-col justify-end p-12 w-full">
                    <div className="max-w-md">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-9 h-9 bg-aqar-cyan rounded-xl flex items-center justify-center shadow-lg shadow-aqar-cyan/20">
                                <span className="text-aqar-btnText font-black text-sm">عقار</span>
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
                            <span className="text-aqar-btnText font-bold text-xs">عقار</span>
                        </div>
                        <span className="text-aqar-text font-bold text-lg">منصة عقار</span>
                    </Link>

                    <h1 className="text-aqar-text text-2xl font-bold mb-2">تسجيل دخول فريق العمل</h1>
                    <p className="text-aqar-muted text-xs mb-6">
                        سجل دخولك كمدير للمكتب (Admin) أو كمشرف (Supervisor) لمتابعة العملاء المكلف بهم.
                    </p>

                    {error && (
                        <div className="flex items-center gap-2 p-3.5 bg-aqar-danger/10 border border-aqar-danger/30 rounded-xl mb-5 text-start">
                            <AlertCircle size={16} className="text-aqar-danger shrink-0" />
                            <p className="text-aqar-danger text-xs font-medium leading-relaxed">{error}</p>
                        </div>
                    )}

                    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="text-xs text-aqar-muted mb-1.5 block">البريد الإلكتروني</label>
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="name@aqar.com"
                                className={`w-full px-4 py-3 bg-aqar-surface border ${errors.email ? 'border-aqar-danger' : 'border-aqar-border'} rounded-xl text-sm text-aqar-text placeholder-aqar-muted/50 focus:border-aqar-cyan/50 focus:outline-none`}
                            />
                            {errors.email && <p className="text-aqar-danger text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="text-xs text-aqar-muted mb-1.5 block">كلمة المرور</label>
                            <div className="relative">
                                <input
                                    {...register("password")}
                                    type={showPass ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-3 ps-10 bg-aqar-surface border ${errors.password ? 'border-aqar-danger' : 'border-aqar-border'} rounded-xl text-sm text-aqar-text placeholder-aqar-muted/50 focus:border-aqar-cyan/50 focus:outline-none`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute start-3 top-1/2 -translate-y-1/2 text-aqar-muted hover:text-aqar-text"
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-aqar-danger text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-aqar-cyan hover:bg-aqar-cyan/90 text-aqar-btnText font-bold text-sm rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-aqar-cyan/10"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : "تسجيل الدخول"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
