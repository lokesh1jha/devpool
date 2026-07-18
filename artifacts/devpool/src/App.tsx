import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';

// Pages
import JobSeekerHomepage from '@/components/JobSeekerHomepage';
import EmployerPage from '@/components/EmployerPage';
import JobsPage from '@/pages/JobsPage';
import JobDetailPage from '@/pages/JobDetailPage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import JobSeekerDashboard from '@/pages/dashboard/JobSeekerDashboard';
import EmployerDashboard from '@/pages/dashboard/EmployerDashboard';
import PostJobPage from '@/pages/PostJobPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={() => <Layout><JobSeekerHomepage /></Layout>} />
      <Route path="/jobseeker" component={() => <Layout><JobSeekerHomepage /></Layout>} />
      <Route path="/employer" component={() => <Layout><EmployerPage /></Layout>} />
      <Route path="/jobs" component={() => <Layout><JobsPage /></Layout>} />
      <Route path="/jobs/:id" component={() => <Layout><JobDetailPage /></Layout>} />

      {/* Auth routes */}
      <Route path="/sign-in" component={() => <Layout><SignInPage /></Layout>} />
      <Route path="/sign-up" component={() => <Layout><SignUpPage /></Layout>} />
      <Route path="/forgot-password" component={() => <Layout><ForgotPasswordPage /></Layout>} />
      <Route path="/auth/callback" component={AuthCallbackPage} />

      {/* Protected routes */}
      <Route
        path="/protected/dashboard/jobseeker"
        component={() => (
          <Layout>
            <ProtectedRoute>
              <JobSeekerDashboard />
            </ProtectedRoute>
          </Layout>
        )}
      />
      <Route
        path="/protected/dashboard/employer"
        component={() => (
          <Layout>
            <ProtectedRoute>
              <EmployerDashboard />
            </ProtectedRoute>
          </Layout>
        )}
      />
      <Route
        path="/protected/post-job"
        component={() => (
          <Layout>
            <ProtectedRoute>
              <PostJobPage />
            </ProtectedRoute>
          </Layout>
        )}
      />
      <Route
        path="/protected/reset-password"
        component={() => (
          <Layout>
            <ProtectedRoute>
              <ResetPasswordPage />
            </ProtectedRoute>
          </Layout>
        )}
      />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
