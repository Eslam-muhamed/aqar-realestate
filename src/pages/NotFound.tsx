import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center text-right" dir="rtl">
            <div className="text-center">
                <p className="text-[#00E5FF] font-mono text-sm font-medium uppercase tracking-widest mb-4" dir="ltr">404 غير موجود</p>
                <h1 className="text-white text-5xl font-bold mb-4">الصفحة غير موجودة</h1>
                <p className="text-[#98989D] text-base mb-8">الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
                <Link to="/" className="px-6 py-3 bg-[#00E5FF] text-[#121212] font-semibold text-sm rounded-xl hover:bg-[#00E5FF]/90 transition-colors">
                    العودة للرئيسية
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
