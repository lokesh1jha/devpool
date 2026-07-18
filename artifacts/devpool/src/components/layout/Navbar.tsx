import { Link } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { hasEnvVars } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MobileNavbar from './MobileNavbar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 relative">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/">DevPool</Link>
          <div className="hidden md:ml-6 md:flex md:space-x-8">
            <NavLink href="/jobseeker">For Developers</NavLink>
            <NavLink href="/employer">For Employers</NavLink>
            <NavLink href="/jobs">Browse Jobs</NavLink>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!hasEnvVars ? (
            <div className="flex gap-4 items-center">
              <Badge variant="default" className="font-normal pointer-events-none">
                Please update .env.local file with anon key and url
              </Badge>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="outline" disabled className="opacity-75 cursor-none pointer-events-none">
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm" variant="default" disabled className="opacity-75 cursor-none pointer-events-none">
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              Hey, {user.email}!
              <Button type="button" variant="outline" onClick={signOut}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" variant="default">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
          <MobileNavbar />
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}
