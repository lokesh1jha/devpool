import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobs, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function PostJobPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [type, setType] = useState("FULL_TIME");
  const [status, setStatus] = useState("PUBLISHED");

  const mutation = useMutation({
    mutationFn: jobs.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      toast({ description: "Job posted successfully!" });
      navigate("/dashboard/employer");
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        description: err instanceof ApiError ? err.message : "Failed to post job",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement).value.trim();

    mutation.mutate({
      title: get("title"),
      description: get("description"),
      requirements: get("requirements") || undefined,
      location: get("location") || undefined,
      type: type as never,
      status: status as never,
      salaryMin: get("salaryMin") ? Number(get("salaryMin")) : undefined,
      salaryMax: get("salaryMax") ? Number(get("salaryMax")) : undefined,
    } as never);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Post a job</h1>
        <p className="text-sm text-muted-foreground mt-1">Fill in the details to start receiving applications</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Job title *</Label>
          <Input id="title" name="title" placeholder="e.g. Senior React Developer" required />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Job type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"].map((t) => (
                  <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="Remote, New York, etc." />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="salaryMin">Salary min (USD/yr)</Label>
            <Input id="salaryMin" name="salaryMin" type="number" placeholder="80000" min={0} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salaryMax">Salary max (USD/yr)</Label>
            <Input id="salaryMax" name="salaryMax" type="number" placeholder="120000" min={0} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe the role, team, and what you're building…"
            rows={6}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">Requirements</Label>
          <Textarea
            id="requirements"
            name="requirements"
            placeholder="Years of experience, skills, qualifications…"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>Publish status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLISHED">Publish immediately</SelectItem>
              <SelectItem value="DRAFT">Save as draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Posting…" : "Post job"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/dashboard/employer")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
