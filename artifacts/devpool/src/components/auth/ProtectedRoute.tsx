import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'wouter';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/sign-in" />;
  }

  return <>{children}</>;
}
