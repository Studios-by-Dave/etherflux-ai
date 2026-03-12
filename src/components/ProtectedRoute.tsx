import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

// TEMPORARY: Authentication bypassed for testing
// TODO: Re-enable auth check before production launch
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading } = useAuth();

  // Show loading spinner briefly to avoid layout shift
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  // BYPASSED: Always allow access during testing
  // if (!user) {
  //   return <Navigate to="/auth" replace />;
  // }

  return <>{children}</>;
};

export default ProtectedRoute;
