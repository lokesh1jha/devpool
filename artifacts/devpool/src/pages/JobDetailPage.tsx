import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const jobDetails = {
  id: 1,
  title: 'Senior Frontend Developer',
  company: 'Tech Innovators Inc.',
  location: 'San Francisco, CA (Remote)',
  salary: '$120,000 - $160,000',
  description: 'We are seeking a talented Senior Frontend Developer to join our dynamic team. You will be responsible for building high-quality user interfaces and collaborating with our product and design teams.',
  requirements: [
    '5+ years of experience with React and modern JavaScript',
    'Strong understanding of web technologies and best practices',
    'Experience with state management (Redux, MobX, etc.)',
    'Familiarity with server-side rendering and Next.js',
  ],
};

export default function JobDetails() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [isApplied, setIsApplied] = useState(false);

  const handleApply = () => {
    console.log('job applied for id:', params.id);
    setIsApplied(true);
  };

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" className="mb-4" onClick={() => navigate('/jobs')}>
        ← Back to Jobs
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{jobDetails.title}</CardTitle>
          <p className="text-xl text-muted-foreground">{jobDetails.company}</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{jobDetails.location}</p>
            </div>
            <div>
              <h3 className="font-semibold">Salary Range</h3>
              <p>{jobDetails.salary}</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Job Description</h3>
            <p>{jobDetails.description}</p>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Requirements</h3>
            <ul className="list-disc pl-5">
              {jobDetails.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          <Button onClick={handleApply} disabled={isApplied}>
            {isApplied ? 'Applied' : 'Apply Now'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
