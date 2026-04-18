import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTE_PATHS } from "@/lib/index";
import LoadingPage from "./LoadingPage";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session, loading, profile } = useAuth();

  const location = useLocation();
  if (loading) {
    return (
      <LoadingPage />
    );
  }


  if (!session) {
    return <Navigate to={ROUTE_PATHS.LOGIN + `?redirect=${location.pathname}`} state={{ from: location }} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    toast.error("المدير فقط من لديه صلاحية لهذه الصفحة")
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
