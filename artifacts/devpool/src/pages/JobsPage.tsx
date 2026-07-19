import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { jobs, type Job } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, DollarSign, Briefcase, Search } from "lucide-react";

function JobCard({ job }: { job: Job }) {
  const salary =
    job.salaryMin && job.salaryMax
      ? `${job.salaryCurrency} ${(job.salaryMin / 1000).toFixed(0)}k – ${(job.salaryMax / 1000).toFixed(0)}k`
      : null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">
            <Link href={`/jobs/${job.id}`} className="hover:underline">
              {job.title}
            </Link>
          </CardTitle>
          <Badge variant="secondary" className="shrink-0 text-xs">
            {job.type.replace("_", " ")}
          </Badge>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{job.company.name}</p>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {job.location}
            </span>
          )}
          {salary && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> {salary}
            </span>
          )}
        </div>
        <Link href={`/jobs/${job.id}`}>
          <Button size="sm" variant="outline" className="w-full">
            View details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobs", { search, type, page }],
    queryFn: () =>
      jobs.list({
        ...(search ? { search } : {}),
        ...(type !== "all" ? { type } : {}),
        page,
        limit: 12,
      }),
  });

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Browse Jobs</h1>
        <p className="text-muted-foreground">Find your next opportunity</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs…"
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="FULL_TIME">Full-time</SelectItem>
            <SelectItem value="PART_TIME">Part-time</SelectItem>
            <SelectItem value="CONTRACT">Contract</SelectItem>
            <SelectItem value="INTERNSHIP">Internship</SelectItem>
            <SelectItem value="REMOTE">Remote</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-40 animate-pulse bg-muted" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-muted-foreground">
          Failed to load jobs. Is the API server running?
        </div>
      )}

      {data && data.jobs.length === 0 && (
        <div className="text-center py-20 space-y-2">
          <Briefcase className="w-10 h-10 mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground">No jobs found</p>
        </div>
      )}

      {data && data.jobs.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground">{data.total} job{data.total !== 1 ? "s" : ""} found</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          {data.pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="flex items-center text-sm text-muted-foreground px-2">
                {page} / {data.pages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
