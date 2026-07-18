import { useState } from 'react';
import { useLocation } from 'wouter';
import { JobPostingForm } from '@/components/JobPostingForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
}

export default function PostJobPage() {
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [, navigate] = useLocation();

  const handleJobSubmit = (data: JobData) => {
    setJobData(data);
    // In production this would integrate with Stripe payment + API
    setSubmitted(true);
  };

  if (submitted && jobData) {
    return (
      <div className="container mx-auto p-4 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-green-600">Job Posted Successfully!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your job listing for <strong>{jobData.title}</strong> at <strong>{jobData.company}</strong> has been submitted.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Note: Stripe payment integration requires a configured API key. Contact support to enable payments.
            </p>
            <button
              className="text-blue-500 underline"
              onClick={() => navigate('/protected/dashboard/employer')}
            >
              Go to dashboard
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <h1 className="text-3xl font-bold mb-6">Post a Job</h1>
      <JobPostingForm onSubmit={handleJobSubmit} />
    </div>
  );
}
