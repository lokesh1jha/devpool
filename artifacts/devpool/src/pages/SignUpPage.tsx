import { useState } from 'react';
import { Link } from 'wouter';
import { supabase, hasEnvVars } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormMessage, type Message } from '@/components/FormMessage';
import { SmtpMessage } from '@/components/SmtpMessage';

function NoEnvVarsWarning() {
  return (
    <div className="flex flex-col min-w-64 max-w-64 mx-auto py-8">
      <h1 className="text-2xl font-medium mb-4">Sign up</h1>
      <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
        <strong>Supabase not configured.</strong> Add <code>VITE_SUPABASE_URL</code> and{' '}
        <code>VITE_SUPABASE_ANON_KEY</code> to your environment secrets to enable authentication.
      </div>
    </div>
  );
}

export default function SignUpPage() {
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

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage({ error: error.message });
    } else {
      setMessage({ success: 'Thanks for signing up! Please check your email for a verification link.' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl flex flex-col gap-12 items-start py-8">
      <form className="flex flex-col min-w-64 max-w-64 mx-auto" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-medium">Sign up</h1>
        <p className="text-sm text-foreground">
          Already have an account?{' '}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Sign in
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="email" placeholder="you@example.com" required />
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" placeholder="Your password" minLength={6} required />
          <Button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </Button>
          {message && <FormMessage message={message} />}
        </div>
      </form>
      <SmtpMessage />
    </div>
  );
}
