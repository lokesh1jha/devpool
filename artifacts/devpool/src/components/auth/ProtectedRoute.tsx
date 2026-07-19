import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ("CANDIDATE" | "EMPLOYER" | "ADMIN")[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/sign-in");
      return;
    }
    if (roles && !roles.includes(user.role as never)) {
      navigate("/");
    }
  }, [user, loading, navigate, roles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  if (!user) return null;
  if (roles && !roles.includes(user.role as never)) return null;

  return <>{children}</>;
}
