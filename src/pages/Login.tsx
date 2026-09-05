import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        setTimeout(() => {
            const result = login(form.email, form.password);
            setLoading(false);
            if (result.success) {
                toast.success("Welcome back");
                navigate("/dashboard");
            } else {
                setError(result.error || "Login failed.");
            }
        }, 600);
    };

    return (
        <div className="min-h-screen bg-[#121212] flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1200&q=80" alt="Property"
                    className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/80 to-black/30" />
                <div className="relative z-10 flex flex-col justify-end p-12">
                    <div className="max-w-md">
                        <div className="flex items-center gap-2 mb-12">
                            <div className="w-7 h-7 bg-[#00E5FF] rounded-sm flex items-center justify-center">
                                <span className="text-[#121212] font-bold text-xs font-mono">AQ</span>
                            </div>
                            <span className="text-white font-semibold text-lg">Aqar</span>
                        </div>
                        <blockquote className="text-white text-2xl font-medium leading-snug mb-4">
                            "Aqar helped us find our family's home in exactly the district we wanted."
                        </blockquote>
                        <p className="text-white/60 text-sm">— Omar Al-Farsi, Riyadh</p>
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="w-full lg:w-[480px] flex flex-col justify-center px-8 lg:px-16">
                <div className="max-w-sm mx-auto w-full">
                    <Link to="/" className="flex items-center gap-2 mb-12 lg:hidden">
                        <div className="w-7 h-7 bg-[#00E5FF] rounded-sm flex items-center justify-center">
                            <span className="text-[#121212] font-bold text-xs font-mono">AQ</span>
                        </div>
                        <span className="text-white font-semibold text-lg">Aqar</span>
                    </Link>

                    <h1 className="text-white text-2xl font-bold mb-2">Sign in to your account</h1>
                    <p className="text-[#98989D] text-sm mb-8">
                        Don't have an account? <Link to="/signup" className="text-[#00E5FF] hover:underline">Create one</Link>
                    </p>

                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl mb-6">
                            <AlertCircle size={14} className="text-[#FF453A] shrink-0" />
                            <p className="text-[#FF453A] text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-[#98989D] mb-1.5 block">Email</label>
                            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-[#98989D] mb-1.5 block">Password</label>
                            <div className="relative">
                                <input required type={showPass ? "text" : "password"} value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Your password"
                                    className="w-full px-4 py-3 pr-10 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none" />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98989D] hover:text-white">
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3.5 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl hover:bg-[#00E5FF]/90 transition-colors disabled:opacity-60 mt-2">
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl">
                        <p className="text-[#98989D] text-xs mb-2 font-medium">Demo Accounts:</p>
                        <p className="text-[#98989D] text-xs">User: omar@example.com / password123</p>
                        <p className="text-[#98989D] text-xs">Agent: khalid@aqar.com / agent123</p>
                        <p className="text-[#98989D] text-xs">Admin: admin@aqar.com / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
