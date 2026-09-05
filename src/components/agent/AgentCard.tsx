import { Link } from "react-router-dom";
import { Star, MapPin, Phone, BadgeCheck, Building2 } from "lucide-react";
import type { Agent } from "@/types";

interface Props { agent: Agent; }

export default function AgentCard({ agent }: Props) {
    return (
        <div className="bg-[#1E1E1E] border border-[#2C2C2E] rounded-2xl p-6 hover:border-[#3C3C3E] transition-all duration-300 hover:-translate-y-0.5 group">
            <div className="flex items-start gap-4 mb-5">
                <div className="relative shrink-0">
                    <img src={agent.avatar} alt={agent.name} className="w-14 h-14 rounded-xl object-cover" />
                    {agent.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#00E5FF] rounded-full flex items-center justify-center">
                            <BadgeCheck size={11} className="text-[#121212]" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm truncate group-hover:text-[#00E5FF] transition-colors">{agent.name}</h3>
                    <p className="text-[#98989D] text-xs mt-0.5">{agent.title}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-xs font-medium">{agent.rating}</span>
                        <span className="text-[#98989D] text-xs">({agent.reviews} reviews)</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-xs text-[#98989D]">
                    <Building2 size={12} className="text-[#00E5FF]" />
                    <span>{agent.company}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#98989D]">
                    <MapPin size={12} className="text-[#00E5FF]" />
                    <span>{agent.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#98989D]">
                    <Phone size={12} className="text-[#00E5FF]" />
                    <span>{agent.phone}</span>
                </div>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-[#2C2C2E] mb-4">
                <div>
                    <p className="text-white font-mono font-semibold text-sm">{agent.listings}</p>
                    <p className="text-[#98989D] text-xs">Active Listings</p>
                </div>
                <div className="h-8 w-px bg-[#2C2C2E]" />
                <div className="text-right">
                    <p className="text-white font-mono font-semibold text-sm">{agent.reviews}</p>
                    <p className="text-[#98989D] text-xs">Reviews</p>
                </div>
            </div>

            <div className="flex gap-2">
                <a href={`tel:${agent.phone}`}
                    className="flex-1 py-2.5 bg-[#121212] border border-[#2C2C2E] text-xs font-medium text-white text-center rounded-xl hover:border-[#00E5FF]/40 transition-colors">
                    Call
                </a>
                <Link to={`/agents/${agent.id}`}
                    className="flex-1 py-2.5 bg-[#00E5FF] text-[#121212] text-xs font-semibold text-center rounded-xl hover:bg-[#00E5FF]/90 transition-colors">
                    View Profile
                </Link>
            </div>
        </div>
    );
}
