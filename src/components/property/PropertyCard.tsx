import { Heart, BedDouble, Bath, Square, MapPin, BadgeCheck, ArrowLeftRight, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn, formatPrice } from "@/lib/utils";
import type { Property } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";
import { compareStorage } from "@/lib/storage";
import { toast } from "sonner";

interface Props {
    property: Property;
    className?: string;
    isDashboard?: boolean;
    onDelete?: (id: string) => void;
}

export default function PropertyCard({ property, className, isDashboard, onDelete }: Props) {
    const { toggle, isFavorite } = useFavorites();
    const fav = isFavorite(property.id);

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        const added = toggle(property.id);
        toast(added ? "تم الحفظ في المفضلة" : "تمت الإزالة من المفضلة", {
            description: property.title,
            duration: 2000,
        });
    };

    const handleCompare = (e: React.MouseEvent) => {
        e.preventDefault();
        const success = compareStorage.add(property.id);
        if (success) toast.success("تمت الإضافة للمقارنة", { description: "اعرض صفحة المقارنة لمقارنة العقارات." });
        else toast.error("لا يمكن الإضافة", { description: "الحد الأقصى 4 عقارات أو مضاف مسبقاً." });
    };

    const typeLabel = property.type.charAt(0).toUpperCase() + property.type.slice(1);
    const bedsLabel = property.stats.bedrooms === 0 ? "استوديو" : `${property.stats.bedrooms}`;

    return (
        <Link to={`/property/${property.slug}`} className={cn("property-card group block", className)}>
            <div className="bg-aqar-surface border border-aqar-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-aqar-muted hover:shadow-lg dark:hover:border-[#3C3C3E] dark:hover:shadow-black/40 shadow-sm dark:shadow-none">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"}
                        alt={property.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 start-3 flex items-center gap-2">
                        <span className={cn("px-2.5 py-1 text-xs font-semibold rounded-md",
                            property.status === "for-sale" ? "bg-aqar-cyan text-[#121212]" : "bg-[#32D74B] text-[#121212]"
                        )}>
                            {property.status === "for-sale" ? "للبيع" : "للإيجار"}
                        </span>
                        {property.featured && (
                            <span className="px-2.5 py-1 text-xs font-medium bg-white/10 backdrop-blur-sm text-aqar-text rounded-md border border-white/20">
                                مميز
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-3 end-3 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                        {!isDashboard && (
                            <>
                                <button onClick={handleFavorite} aria-label="حفظ في المفضلة"
                                    className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                                        fav ? "bg-[#FF453A] text-aqar-text" : "bg-aqar-base/80 backdrop-blur-sm text-aqar-text hover:bg-[#FF453A]"
                                    )}>
                                    <Heart size={14} fill={fav ? "currentColor" : "none"} />
                                </button>
                                <button onClick={handleCompare} aria-label="مقارنة العقار"
                                    className="w-8 h-8 rounded-lg bg-aqar-base/80 backdrop-blur-sm text-aqar-text hover:bg-aqar-cyan hover:text-[#121212] flex items-center justify-center transition-colors">
                                    <ArrowLeftRight size={14} />
                                </button>
                            </>
                        )}
                        {isDashboard && (
                            <>
                                <Link to={`/edit-property/${property.id}`} aria-label="تعديل العقار"
                                    className="w-8 h-8 rounded-lg bg-aqar-base/80 backdrop-blur-sm text-aqar-text hover:bg-aqar-cyan hover:text-[#121212] flex items-center justify-center transition-colors">
                                    <Pencil size={14} />
                                </Link>
                                <button onClick={(e) => { e.preventDefault(); onDelete?.(property.id); }} aria-label="حذف العقار"
                                    className="w-8 h-8 rounded-lg bg-aqar-base/80 backdrop-blur-sm text-aqar-text hover:bg-[#FF453A] hover:text-white flex items-center justify-center transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Type */}
                    <div className="absolute bottom-3 start-3">
                        <span className="text-xs font-medium text-aqar-text/70">{typeLabel}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-aqar-text text-sm font-semibold leading-snug line-clamp-1 group-hover:text-aqar-cyan transition-colors">
                            {property.title}
                        </h3>
                        {property.verified && <BadgeCheck size={15} className="text-aqar-cyan shrink-0 mt-0.5" />}
                    </div>

                    <div className="flex items-center gap-1.5 text-aqar-muted text-xs mb-4">
                        <MapPin size={11} />
                        <span>{property.location.district}, {property.location.city}</span>
                    </div>

                    <div className="font-mono text-aqar-cyan text-lg font-semibold mb-4">
                        {formatPrice(property.price, property.currency)}
                        {property.status === "for-rent" && <span className="text-aqar-muted text-xs font-sans font-normal ms-1">سنوياً</span>}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-aqar-border">
                        <div className="flex items-center gap-1.5 text-aqar-muted text-xs">
                            <BedDouble size={13} />
                            <span>{bedsLabel} {bedsLabel !== "استوديو" ? "غرف" : ""}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-aqar-muted text-xs">
                            <Bath size={13} />
                            <span>{property.stats.bathrooms} دورات مياه</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-aqar-muted text-xs">
                            <Square size={13} />
                            <span>{property.stats.area} m²</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
