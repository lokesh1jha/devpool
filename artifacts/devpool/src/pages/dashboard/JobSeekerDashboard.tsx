import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { applications } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock, CheckCircle2 } from "lucide-react";

const STAGE_LABEL: Record<string, string> = {
  APPLIED: "Applied",
  RESUME_REVIEWED: "Under review",
  SHORTLISTED: "Shortlisted",
  INTERVIEW_SCHEDULED: "Interview scheduled",
  INTERVIEW_COMPLETED: "Interview completed",
  OFFER_SENT: "Offer sent",
  OFFER_ACCEPTED: "Offer accepted",
  HIRED: "Hired",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const STAGE_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  APPLIED: "secondary",
  RESUME_REVIEWED: "secondary",
  SHORTLISTED: "default",
  INTERVIEW_SCHEDULED: "default",
  INTERVIEW_COMPLETED: "default",
  OFFER_SENT: "default",
  OFFER_ACCEPTED: "default",
  HIRED: "default",
  REJECTED: "destructive",
  WITHDRAWN: "outline",
};

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["applications", "mine"],
    queryFn: () => applications.list(),
  });

  const apps = (data?.applications ?? []) as Array<{
    id: string;
    stage: string;
    createdAt: string;
    job: { id: string; title: string; company: { name: string } };
  }>;

  const active = apps.filter((a) => !["REJECTED", "WITHDRAWN", "HIRED"].includes(a.stage));
  const closed = apps.filter((a) => ["REJECTED", "WITHDRAWN", "HIRED"].includes(a.stage));

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Track your applications and interviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total applied", value: apps.length, icon: Briefcase },
          { label: "In progress", value: active.length, icon: Clock },
          { label: "Completed", value: closed.length, icon: CheckCircle2 },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" /> {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Applications */}
      <div className="space-y-3">
        <h2 className="font-medium">Active applications</h2>
        {isLoading && (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        )}
        {!isLoading && active.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground text-sm space-y-3">
              <Briefcase className="w-8 h-8 mx-auto opacity-30" />
              <p>No active applications yet.</p>
              <Link href="/jobs">
                <Button size="sm" variant="outline">Browse jobs</Button>
              </Link>
            </CardContent>
          </Card>
        )}
        {active.map((app) => (
          <Card key={app.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5 min-w-0">
                <p className="font-medium text-sm truncate">{app.job.title}</p>
                <p className="text-xs text-muted-foreground">{app.job.company.name}</p>
              </div>
              <Badge variant={STAGE_VARIANT[app.stage] ?? "secondary"} className="shrink-0">
                {STAGE_LABEL[app.stage] ?? app.stage}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {closed.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-medium text-muted-foreground">Past applications</h2>
          {closed.map((app) => (
            <Card key={app.id} className="opacity-60">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="font-medium text-sm truncate">{app.job.title}</p>
                  <p className="text-xs text-muted-foreground">{app.job.company.name}</p>
                </div>
                <Badge variant={STAGE_VARIANT[app.stage] ?? "outline"} className="shrink-0">
                  {STAGE_LABEL[app.stage] ?? app.stage}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
