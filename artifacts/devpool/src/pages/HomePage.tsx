import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { jobs } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Briefcase, Users, Zap, MapPin } from "lucide-react";

export default function HomePage() {
  const { data } = useQuery({
    queryKey: ["jobs", { page: 1, limit: 6 }],
    queryFn: () => jobs.list({ limit: 6 }),
  });

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center text-center py-24 px-4 max-w-4xl mx-auto w-full gap-6">
        <Badge variant="secondary" className="text-xs font-normal">
          Modern Hiring OS for Startups
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
          Find your next great<br />engineering role
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          DevPool connects talented developers with the startups and companies building the future. Clean process, real opportunities.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/jobs">
            <Button size="lg">Browse jobs <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
          <Link href="/sign-up">
            <Button size="lg" variant="outline">Post a job</Button>
          </Link>
        </div>
      </section>

      {/* Feature strip */}
      <section className="border-y bg-muted/30 py-14 px-4">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Briefcase, title: "Quality listings", body: "Every job is reviewed. No noise, no spam." },
            { icon: Users, title: "Great companies", body: "Startups and scaleups building real products." },
            { icon: Zap, title: "Fast process", body: "Apply in seconds, hear back in days, not weeks." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="space-y-2">
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest jobs */}
      {data && data.jobs.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">Latest openings</h2>
              <Link href="/jobs">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {data.jobs.map((job) => (
                <Link href={`/jobs/${job.id}`} key={job.id}>
                  <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-sm leading-snug">{job.title}</span>
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {job.type.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{job.company.name}</p>
                      {job.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-lg mx-auto space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to hire?</h2>
          <p className="text-muted-foreground text-sm">
            Post your first job in minutes and start receiving qualified applications today.
          </p>
          <Link href="/sign-up">
            <Button>Get started free <ArrowRight className="w-4 h-4 ml-1" /></Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
