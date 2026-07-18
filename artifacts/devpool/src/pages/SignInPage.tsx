import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { supabase, hasEnvVars } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormMessage, type Message } from '@/components/FormMessage';

function NoEnvVarsWarning() {
  return (
    <div className="flex-1 flex flex-col min-w-64 py-8">
      <h1 className="text-2xl font-medium mb-4">Sign in</h1>
      <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
        <strong>Supabase not configured.</strong> Add <code>VITE_SUPABASE_URL</code> and{' '}
        <code>VITE_SUPABASE_ANON_KEY</code> to your environment secrets to enable authentication.
      </div>
    </div>
  );
}

export default function SignInPage() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  if (!hasEnvVars) return <NoEnvVarsWarning />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage({ error: error.message });
      setLoading(false);
    } else {
      navigate('/protected/dashboard/jobseeker');
    }
  };

  return (
    <div className="max-w-7xl flex flex-col gap-12 items-start py-8">
      <form className="flex-1 flex flex-col min-w-64" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm text-foreground">
          Don&apos;t have an account?{' '}
          <Link className="text-foreground font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="email" placeholder="you@example.com" required />
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link className="text-xs text-foreground underline" href="/forgot-password">
              Forgot Password?
            </Link>
          </div>
          <Input type="password" name="password" placeholder="Your password" required />
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign in'}
          </Button>
          {message && <FormMessage message={message} />}
        </div>
      </form>
    </div>
  );
}
