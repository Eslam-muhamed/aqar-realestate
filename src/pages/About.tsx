import { Link } from "react-router-dom";
import { CheckCircle, Users, Globe, Award } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const MILESTONES = [
    { year: "2018", title: "Founded in Riyadh", desc: "Aqar launched with a focus on Riyadh's premium residential market." },
    { year: "2020", title: "Expanded to Jeddah & UAE", desc: "Coverage grew to include Jeddah, Dubai, and Abu Dhabi." },
    { year: "2022", title: "1,000+ Active Listings", desc: "Reached a landmark of 1,000 verified properties on the platform." },
    { year: "2024", title: "Regional Leader", desc: "Became the most trusted premium property platform across Saudi Arabia." },
];

const VALUES = [
    { icon: CheckCircle, title: "Verified First", desc: "Every property and agent on Aqar is manually verified before appearing on the platform." },
    { icon: Users, title: "Client-Centered", desc: "We measure success by how well we match clients to the right property, not by volume." },
    { icon: Globe, title: "Regional Expertise", desc: "Deep local knowledge across each market we operate in, not a generic global approach." },
    { icon: Award, title: "Professional Standards", desc: "We hold our agents to the highest professional and ethical standards in the industry." },
];

export default function About() {
    return (
        <div className="min-h-screen bg-[#121212]">
            <Header />
            <div className="pt-16">
                {/* Hero */}
                <div className="border-b border-[#2C2C2E]">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                        <p className="text-[#00E5FF] text-xs font-medium uppercase tracking-widest mb-4">About Aqar</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-white text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                                    The premium real estate platform for the MENA region.
                                </h1>
                                <p className="text-[#98989D] text-base leading-relaxed mb-8">
                                    Aqar was built with one purpose: to make the process of finding and transacting premium property simple, trustworthy, and professional. We curate every listing and vet every agent so you never have to second-guess what you are seeing.
                                </p>
                                <div className="flex gap-4">
                                    <Link to="/properties" className="px-6 py-3 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl hover:bg-[#00E5FF]/90 transition-colors">
                                        Browse Properties
                                    </Link>
                                    <Link to="/agents" className="px-6 py-3 border border-[#2C2C2E] text-white text-sm rounded-xl hover:border-[#3C3C3E] transition-colors">
                                        Meet Our Agents
                                    </Link>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: "1,240+", label: "Active Listings" },
                                    { value: "380+", label: "Verified Agents" },
                                    { value: "8", label: "Markets" },
                                    { value: "SAR 4.2B", label: "Properties Sold" },
                                ].map(({ value, label }) => (
                                    <div key={label} className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-6">
                                        <p className="text-white font-mono font-bold text-3xl mb-1">{value}</p>
                                        <p className="text-[#98989D] text-sm">{label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                    <h2 className="text-white text-2xl font-bold mb-10">Our Values</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-6">
                                <div className="w-10 h-10 border border-[#2C2C2E] rounded-xl flex items-center justify-center mb-5">
                                    <Icon size={18} className="text-[#00E5FF]" />
                                </div>
                                <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
                                <p className="text-[#98989D] text-xs leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline */}
                <div className="border-t border-[#2C2C2E]">
                    <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
                        <h2 className="text-white text-2xl font-bold mb-10">Our Journey</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {MILESTONES.map(({ year, title, desc }) => (
                                <div key={year} className="relative pl-6 border-l-2 border-[#2C2C2E]">
                                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
                                    <p className="text-[#00E5FF] font-mono text-sm font-semibold mb-2">{year}</p>
                                    <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
                                    <p className="text-[#98989D] text-xs leading-relaxed">{desc}</p>
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
