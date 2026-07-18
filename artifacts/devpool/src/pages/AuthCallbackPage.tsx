import { useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { supabase, hasEnvVars } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const [, navigate] = useLocation();
  const search = useSearch();

  useEffect(() => {
    if (!hasEnvVars) {
      navigate('/');
      return;
    }

    const params = new URLSearchParams(search);
    const code = params.get('code');
    const redirectTo = params.get('redirect_to');

    const handleCallback = async () => {
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }
      navigate(redirectTo || '/protected/dashboard/jobseeker');
    };

    handleCallback();
  }, [search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Completing sign in...</p>
    </div>
  );
}
