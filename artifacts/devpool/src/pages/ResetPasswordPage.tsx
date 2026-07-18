import { useState } from 'react';
import { useLocation } from 'wouter';
import { supabase, hasEnvVars } from '@/lib/supabase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FormMessage, type Message } from '@/components/FormMessage';

function NoEnvVarsWarning() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md p-4">
        <h1 className="text-2xl font-medium mb-4">Reset password</h1>
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
          <strong>Supabase not configured.</strong> Add <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> to your environment secrets to enable password reset.
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  if (!hasEnvVars) return <NoEnvVarsWarning />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setMessage({ error: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage({ error: error.message });
    } else {
      setMessage({ success: 'Password updated successfully.' });
      setTimeout(() => navigate('/sign-in'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center py-12">
      <form className="flex flex-col w-full max-w-md p-4 gap-2 [&>input]:mb-4" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-medium">Reset password</h1>
        <p className="text-sm text-foreground/60">Please enter your new password below.</p>
        <Label htmlFor="password">New password</Label>
        <Input type="password" name="password" placeholder="New password" required />
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input type="password" name="confirmPassword" placeholder="Confirm password" required />
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Reset password'}
        </Button>
        {message && <FormMessage message={message} />}
      </form>
    </div>
  );
}
