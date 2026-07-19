import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Router as WouterRouter } from "wouter";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";

// Pages
import HomePage from "@/pages/HomePage";
import JobsPage from "@/pages/JobsPage";
import JobDetailPage from "@/pages/JobDetailPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import JobSeekerDashboard from "@/pages/dashboard/JobSeekerDashboard";
import EmployerDashboard from "@/pages/dashboard/EmployerDashboard";
import PostJobPage from "@/pages/PostJobPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={() => <Layout><HomePage /></Layout>} />
      <Route path="/jobs" component={() => <Layout><JobsPage /></Layout>} />
      <Route path="/jobs/:id" component={() => <Layout><JobDetailPage /></Layout>} />

      {/* Auth */}
      <Route path="/sign-in" component={() => <Layout><SignInPage /></Layout>} />
      <Route path="/sign-up" component={() => <Layout><SignUpPage /></Layout>} />
      <Route path="/forgot-password" component={() => <Layout><ForgotPasswordPage /></Layout>} />

      {/* Protected — candidate */}
      <Route
        path="/dashboard"
        component={() => (
          <Layout>
            <ProtectedRoute>
              <JobSeekerDashboard />
            </ProtectedRoute>
          </Layout>
        )}
      />
      <Route
        path="/dashboard/jobseeker"
        component={() => (
          <Layout>
            <ProtectedRoute roles={["CANDIDATE"]}>
              <JobSeekerDashboard />
            </ProtectedRoute>
          </Layout>
        )}
      />

      {/* Protected — employer */}
      <Route
        path="/dashboard/employer"
        component={() => (
          <Layout>
            <ProtectedRoute roles={["EMPLOYER", "ADMIN"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          </Layout>
        )}
      />
      <Route
        path="/post-job"
        component={() => (
          <Layout>
            <ProtectedRoute roles={["EMPLOYER", "ADMIN"]}>
              <PostJobPage />
            </ProtectedRoute>
          </Layout>
        )}
      />

      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
