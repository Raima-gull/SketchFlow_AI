import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Sparkles } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading, checkAuth, isInitialized } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  // ✅ Premium Loader (Without Text)
  if (isLoading && !isInitialized) {
    return (
      <div className="sketchflow-loader">
        <div className="sketchflow-loader-box">
          <Sparkles size={28} className="text-black" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}