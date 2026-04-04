
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";

export function ActiveUserGuard({ children }: { children: React.ReactNode }) {
    const { isUserActive, loading } = useAuth();

    if (loading) return null;

    if (!isUserActive) {
        toast.error("حسابك غير نشط. لا يمكنك القيام بعمليات تعديل.");
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}