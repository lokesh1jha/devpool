import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { jobs, applications, ApiError } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, DollarSign, Calendar, ArrowLeft } from "lucide-react";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["job", params.id],
    queryFn: () => jobs.get(params.id),
    enabled: !!params.id,
  });

  const job = data?.job;

  const handleApply = async () => {
    if (!user) { navigate("/sign-in"); return; }
    setApplying(true);
    setApplyError(null);
    try {
      await applications.apply({ jobId: params.id });
      setApplied(true);
    } catch (err) {
      setApplyError(err instanceof ApiError ? err.message : "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (isLoading) return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded w-2/3" />
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-40 bg-muted rounded" />
    </div>
  );

  if (isError || !job) return (
    <div className="max-w-3xl mx-auto py-20 text-center text-muted-foreground">
      Job not found.{" "}
      <Link href="/jobs" className="underline">Back to jobs</Link>
    </div>
  );

  const salary =
    job.salaryMin && job.salaryMax
      ? `${job.salaryCurrency} ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k`
      : null;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2" onClick={() => navigate("/jobs")}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to jobs
      </Button>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h1 className="text-2xl font-semibold tracking-tight">{job.title}</h1>
          <Badge variant="secondary">{job.type.replace("_", " ")}</Badge>
        </div>
        <p className="text-lg font-medium text-muted-foreground">{job.company.name}</p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {job.location}
            </span>
          )}
          {salary && (
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> {salary}
            </span>
          )}
          {job.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Posted {new Date(job.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <h2 className="font-semibold">Description</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{job.description}</p>
          </div>
          {job.requirements && (
            <>
              <Separator />
              <div className="space-y-2">
                <h2 className="font-semibold">Requirements</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{job.requirements}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {applyError && <p className="text-sm text-destructive">{applyError}</p>}

      {user?.role === "CANDIDATE" || !user ? (
        <Button
          size="lg"
          onClick={handleApply}
          disabled={applying || applied}
          className="w-full sm:w-auto"
        >
          {applied ? "Application submitted ✓" : applying ? "Submitting…" : "Apply now"}
        </Button>
      ) : null}

      {!user && (
        <p className="text-sm text-muted-foreground">
          <Link href="/sign-in" className="underline underline-offset-4">Sign in</Link> to apply for this position.
        </p>
      )}
    </div>
  );
}
