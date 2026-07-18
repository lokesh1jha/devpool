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
    <div className="flex-1 flex flex-col w-full min-w-64 max-w-64 mx-auto py-8">
      <h1 className="text-2xl font-medium mb-4">Reset Password</h1>
      <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
        <strong>Supabase not configured.</strong> Add <code>VITE_SUPABASE_URL</code> and{' '}
        <code>VITE_SUPABASE_ANON_KEY</code> to your environment secrets to enable password reset.
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  if (!hasEnvVars) return <NoEnvVarsWarning />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) {
      setMessage({ error: error.message });
    } else {
      setMessage({ success: 'Check your email for a link to reset your password.' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl flex flex-col gap-12 items-start py-8">
      <form
        className="flex-1 flex flex-col w-full gap-2 text-foreground [&>input]:mb-6 min-w-64 max-w-64 mx-auto"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="text-2xl font-medium">Reset Password</h1>
          <p className="text-sm text-secondary-foreground">
            Already have an account?{' '}
            <Link className="text-primary underline" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Email</Label>
          <Input name="email" type="email" placeholder="you@example.com" required />
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Reset Password'}
          </Button>
          {message && <FormMessage message={message} />}
        </div>
      </form>
      <SmtpMessage />
    </div>
  );
}
