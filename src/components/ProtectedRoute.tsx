import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTE_PATHS } from "@/lib/index";
import { useEffect } from "react";
import LoadingPage from "./LoadingPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, loading, isSignedIn } = useAuth();
  // const navigate = useNavigate()
  console.log(session);
  console.log(isSignedIn);

  const location = useLocation();




  if (loading) {
    return (
      <LoadingPage />
    );
  }

  if (!session) {
    return <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: location }} replace />;
  }


  return <>{children}</>;
}
