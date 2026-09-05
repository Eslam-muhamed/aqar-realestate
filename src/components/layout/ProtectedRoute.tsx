import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/types";
import { Loader2 } from "lucide-react";

interface Props {
    children: React.ReactNode;
    roles?: UserRole[];
}

export default function ProtectedRoute({ children, roles }: Props) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-aqar-base flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-aqar-cyan" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
