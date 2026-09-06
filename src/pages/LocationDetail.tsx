import { useParams, Link } from "react-router-dom";
import { MapPin, ArrowRight, Home } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/property/PropertyCard";
import { MOCK_LOCATIONS } from "@/constants/mockData";
import { useProperties } from "@/hooks/useRealData";
import { formatPrice } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function LocationDetail() {
    const { t } = useTranslation();
    const { slug } = useParams();
    const location = MOCK_LOCATIONS.find((l) => l.slug === slug);
    const { data: allProperties = [] } = useProperties();
    const properties = allProperties.filter((p) => location && p.location.city.toLowerCase() === location.name.toLowerCase());

    if (!location) {
        return (
            <div className="min-h-screen bg-aqar-base">
                <Header />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-aqar-text text-lg">{t("locationsPage.notFound")}</p>
                        <Link to="/locations" className="text-aqar-cyan text-sm mt-4 block">{t("locationsPage.backToLocations")}</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-aqar-base text-start">
            <Header />
            <div className="pt-16">
                {/* Hero */}
                <div className="relative h-80 overflow-hidden">
                    <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute bottom-0 start-0 end-0 max-w-[1440px] mx-auto px-6 lg:px-12 pb-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Link to="/locations" className="text-aqar-muted text-sm hover:text-aqar-text transition-colors">{t("locationsPage.subtitle")}</Link>
                            <span className="text-aqar-muted">/</span>
                            <span className="text-aqar-text text-sm">{t(`compare.cityMap.${location.name}`, location.name)}</span>
                        </div>
                        <h1 className="text-aqar-text text-4xl font-bold mb-2">{t(`compare.cityMap.${location.name}`, location.name)}</h1>
                        <div className="flex items-center gap-2 text-aqar-muted text-sm">
                            <MapPin size={13} className="text-aqar-cyan" />
                            <span>{t(`locationsPage.countryMap.${location.country}`, location.country)}</span>
                            <span>·</span>
                            <span className="font-mono">{location.properties} {t("locationsPage.propertiesCount")}</span>
                            <span>·</span>
                            <span dir="ltr">{t("locationsPage.avg")} {formatPrice(location.avgPrice, "SAR")}</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
                    <div className="mb-8">
                        <h2 className="text-aqar-text font-semibold text-xl mb-2">
                            {t("locationsPage.propertiesIn")} {t(`compare.cityMap.${location.name}`, location.name)}
                        </h2>
                        <p className="text-aqar-muted text-sm">{t("locationsPage.availableProps", { count: properties.length })}</p>
                    </div>

                    {properties.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-aqar-border rounded-2xl bg-aqar-surface/30 border-dashed">
                            <Home size={32} className="mx-auto text-aqar-muted mb-4 opacity-50" />
                            <p className="text-aqar-muted text-sm mb-4">{t("locationsPage.noPropsYet")}</p>
                            <Link to="/properties" className="inline-flex items-center gap-2 text-aqar-cyan text-sm font-medium group">
                                {t("locationsPage.viewAll")} <ArrowRight size={14} className="rtl:rotate-180 group-hover:rtl:translate-x-1 group-hover:ltr:-translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
