import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-2.5 shrink-0 group", className)}>
            <div className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 bg-gradient-to-tr from-aqar-cyan to-aqar-cyan/70 rounded-xl shadow-lg shadow-aqar-cyan/20 overflow-hidden transition-transform duration-300 group-hover:scale-105">
                {/* Abstract geometric building icon representing modern real estate */}
                <svg className="w-5 h-5 md:w-6 md:h-6 text-white z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18" />
                    <path d="M9 8h1" />
                    <path d="M9 12h1" />
                    <path d="M9 16h1" />
                    <path d="M14 8h1" />
                    <path d="M14 12h1" />
                    <path d="M14 16h1" />
                    <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                </svg>
            </div>
            <div className="flex flex-col justify-center">
                <span className="text-aqar-text font-black text-xl md:text-2xl leading-none tracking-tighter uppercase font-sans">
                    AMSH
                </span>
                <span className="text-aqar-muted text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase mt-0.5 font-sans leading-none">
                    Real Estate
                </span>
            </div>
        </div>
    );
}
