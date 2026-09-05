import { Link } from "react-router-dom";
import { Star, MapPin, Phone, BadgeCheck, Building2 } from "lucide-react";
import type { Agent } from "@/types";

interface Props { agent: Agent; }

export default function AgentCard({ agent }: Props) {
    return (
        <div className="bg-aqar-surface border border-aqar-border rounded-2xl p-6 hover:border-[#3C3C3E] transition-all duration-300 hover:-translate-y-0.5 group" dir="rtl">
            <div className="flex items-start gap-4 mb-5">
                <div className="relative shrink-0">
                    <img src={agent.avatar} alt={agent.name} className="w-14 h-14 rounded-xl object-cover" />
                    {agent.verified && (
                        <div className="absolute -bottom-1 -end-1 w-5 h-5 bg-aqar-cyan rounded-full flex items-center justify-center">
                            <BadgeCheck size={11} className="text-[#121212]" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0 text-start">
                    <h3 className="text-aqar-text font-semibold text-sm truncate group-hover:text-aqar-cyan transition-colors">{agent.name}</h3>
                    <p className="text-aqar-muted text-xs mt-0.5">{agent.title}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <Star size={11} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-aqar-text text-xs font-medium">{agent.rating}</span>
                        <span className="text-aqar-muted text-xs">({agent.reviews} تقييم)</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2 mb-5 text-start">
                <div className="flex items-center gap-2 text-xs text-aqar-muted">
                    <Building2 size={12} className="text-aqar-cyan" />
                    <span>{agent.company}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-aqar-muted">
                    <MapPin size={12} className="text-aqar-cyan" />
                    <span>{agent.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-aqar-muted">
                    <Phone size={12} className="text-aqar-cyan" />
                    <span dir="ltr">{agent.phone}</span>
                </div>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-aqar-border mb-4 text-start">
                <div>
                    <p className="text-aqar-text font-mono font-semibold text-sm">{agent.listings}</p>
                    <p className="text-aqar-muted text-xs">عقارات نشطة</p>
                </div>
                <div className="h-8 w-px bg-[#2C2C2E]" />
                <div className="text-end">
                    <p className="text-aqar-text font-mono font-semibold text-sm">{agent.reviews}</p>
                    <p className="text-aqar-muted text-xs">مراجعات</p>
                </div>
            </div>

            <div className="flex gap-2">
                <a href={`tel:${agent.phone}`}
                    className="flex-1 py-2.5 bg-aqar-base border border-aqar-border text-xs font-medium text-aqar-text text-center rounded-xl hover:border-aqar-cyan/40 transition-colors">
                    اتصال
                </a>
                <Link to={`/agents/${agent.id}`}
                    className="flex-1 py-2.5 bg-aqar-cyan text-[#121212] text-xs font-semibold text-center rounded-xl hover:bg-aqar-cyan/90 transition-colors">
                    عرض الملف
                </Link>
            </div>
        </div>
    );
}
