import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { jobs, applications } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, TrendingUp, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  PUBLISHED: "default",
  CLOSED: "secondary",
  ARCHIVED: "destructive",
};

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", "employer"],
    queryFn: () => jobs.list({ status: undefined }),
  });

  const { data: appsData } = useQuery({
    queryKey: ["applications", "employer"],
    queryFn: () => applications.list(),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      jobs.update(id, { status } as never),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ description: "Job status updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => jobs.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ description: "Job deleted" });
    },
  });

  const allJobs = jobsData?.jobs ?? [];
  const allApps = (appsData?.applications ?? []) as Array<{ stage: string; job: { title: string } }>;

  const stats = [
    { label: "Total jobs", value: allJobs.length, icon: Briefcase },
    { label: "Active listings", value: allJobs.filter((j) => j.status === "PUBLISHED").length, icon: TrendingUp },
    { label: "Total applicants", value: allApps.length, icon: Users },
  ];

  // Chart data: apps per job (top 5)
  const chartData = allJobs
    .map((j) => ({
      name: j.title.length > 18 ? j.title.slice(0, 18) + "…" : j.title,
      applicants: allApps.filter((a) => a.job?.title === j.title).length,
    }))
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {user?.name?.split(" ")[0]}'s Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your jobs and applications</p>
        </div>
        <Link href="/post-job">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-1" /> Post a job
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
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

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Applications per job</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="applicants" className="fill-primary" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Job listings */}
      <div className="space-y-3">
        <h2 className="font-medium">Your job listings</h2>
        {jobsLoading && (
          <div className="space-y-2">
            {[1, 2].map((i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
          </div>
        )}
        {!jobsLoading && allJobs.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground text-sm space-y-3">
              <Briefcase className="w-8 h-8 mx-auto opacity-30" />
              <p>No jobs posted yet.</p>
              <Link href="/post-job">
                <Button size="sm" variant="outline"><Plus className="w-3.5 h-3.5 mr-1" /> Post first job</Button>
              </Link>
            </CardContent>
          </Card>
        )}
        {allJobs.map((job) => (
          <Card key={job.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-0.5 min-w-0">
                <p className="font-medium text-sm truncate">{job.title}</p>
                <p className="text-xs text-muted-foreground">
                  {job.location ?? "No location"} · {job.type.replace("_", " ")}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={STATUS_VARIANT[job.status] ?? "secondary"}>
                  {job.status}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-7 h-7"
                  title={job.status === "PUBLISHED" ? "Close job" : "Publish"}
                  disabled={publishMutation.isPending}
                  onClick={() =>
                    publishMutation.mutate({
                      id: job.id,
                      status: job.status === "PUBLISHED" ? "CLOSED" : "PUBLISHED",
                    })
                  }
                >
                  {job.status === "PUBLISHED" ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-7 h-7 text-destructive hover:text-destructive"
                  title="Delete"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(job.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
