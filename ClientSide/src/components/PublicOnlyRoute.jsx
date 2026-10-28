import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

/**
 * PublicOnlyRoute
 * - Agar user ALREADY logged in hai → /dashboard (ya "from") pe redirect
 * - Agar user logged in NAHI hai → children render (login/register form dikhao)
 * - Jab tak checkAuth complete nahi hota, loader dikhao
 */
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, isLoading, checkAuth, isInitialized } = useAuthStore();
  const location = useLocation();

  // Agar store initialize nahi hua to checkAuth chalao
  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  // Pehli baar check hone tak loader
  if (isLoading && !isInitialized) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#00E5FF] text-lg">
        Loading…
      </div>
    );
  }

  // Already logged in → dashboard pe bhej do
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  // Not logged in → login/register form dikhao
  return children;
}