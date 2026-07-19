import { Link } from "wouter";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <Briefcase className="w-4 h-4" />
          DevPool
        </div>
        <nav className="flex gap-5">
          <Link href="/jobs" className="hover:text-foreground transition-colors">Jobs</Link>
          <Link href="/sign-up" className="hover:text-foreground transition-colors">Post a job</Link>
          <Link href="/sign-in" className="hover:text-foreground transition-colors">Sign in</Link>
        </nav>
        <p>© {new Date().getFullYear()} DevPool. All rights reserved.</p>
      </div>
    </footer>
  );
}
