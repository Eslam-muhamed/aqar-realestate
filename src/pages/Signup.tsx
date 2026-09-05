import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Signup() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
        if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
        setLoading(true);
        setTimeout(() => {
            const result = signup(form.name, form.email, form.password);
            setLoading(false);
            if (result.success) {
                toast.success("Account created successfully");
                navigate("/dashboard");
            } else {
                setError(result.error || "Signup failed.");
            }
        }, 600);
    };

    return (
        <div className="min-h-screen bg-[#121212] flex">
            {/* Left */}
            <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80" alt="Luxury Property"
                    className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/80 to-black/30" />
                <div className="relative z-10 flex flex-col justify-end p-12">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-7 h-7 bg-[#00E5FF] rounded-sm flex items-center justify-center">
                            <span className="text-[#121212] font-bold text-xs font-mono">AQ</span>
                        </div>
                        <span className="text-white font-semibold text-lg">Aqar</span>
                    </div>
                    <h2 className="text-white text-3xl font-bold max-w-sm">Join thousands of property seekers across the MENA region.</h2>
                </div>
            </div>

            {/* Right */}
            <div className="w-full lg:w-[480px] flex flex-col justify-center px-8 lg:px-16">
                <div className="max-w-sm mx-auto w-full">
                    <Link to="/" className="flex items-center gap-2 mb-12 lg:hidden">
                        <div className="w-7 h-7 bg-[#00E5FF] rounded-sm flex items-center justify-center">
                            <span className="text-[#121212] font-bold text-xs font-mono">AQ</span>
                        </div>
                        <span className="text-white font-semibold text-lg">Aqar</span>
                    </Link>

                    <h1 className="text-white text-2xl font-bold mb-2">Create your account</h1>
                    <p className="text-[#98989D] text-sm mb-8">
                        Already have an account? <Link to="/login" className="text-[#00E5FF] hover:underline">Sign in</Link>
                    </p>

                    {error && (
                        <div className="flex items-center gap-2 p-4 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl mb-6">
                            <AlertCircle size={14} className="text-[#FF453A] shrink-0" />
                            <p className="text-[#FF453A] text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-[#98989D] mb-1.5 block">Full Name</label>
                            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name"
                                className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-[#98989D] mb-1.5 block">Email</label>
                            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com"
                                className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none" />
                        </div>
                        <div>
                            <label className="text-xs text-[#98989D] mb-1.5 block">Password</label>
                            <div className="relative">
                                <input required type={showPass ? "text" : "password"} value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters"
                                    className="w-full px-4 py-3 pr-10 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none" />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#98989D]">
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-[#98989D] mb-1.5 block">Confirm Password</label>
                            <input required type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                placeholder="Repeat password"
                                className="w-full px-4 py-3 bg-[#1E1E1E] border border-[#2C2C2E] rounded-xl text-sm text-white placeholder-[#98989D]/50 focus:border-[#00E5FF]/50 focus:outline-none" />
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-3.5 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl hover:bg-[#00E5FF]/90 transition-colors disabled:opacity-60 mt-2">
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-[#98989D] text-xs leading-relaxed">
                        By creating an account you agree to our{" "}
                        <a href="#" className="text-[#00E5FF] hover:underline">Terms of Service</a> and{" "}
                        <a href="#" className="text-[#00E5FF] hover:underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
