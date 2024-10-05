'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JobPostingForm } from '@/components/JobPostingForm'
import { PaymentForm } from '@/components/PaymentForm'

// Define the JobData type here (or import it from another file if already defined)
interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
}

export default function PostJobPage() {
  const [jobData, setJobData] = useState<JobData | null>(null)  // Set initial state to null or JobData
  const router = useRouter()

  const handleJobSubmit = (data: JobData) => {  // Correct type for the data argument
    setJobData(data)
  }

  const handlePaymentSuccess = async () => {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    })
    if (response.ok) {
      router.push('/dashboard/employer')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Post a New Job</h1>
      {!jobData ? (
        <JobPostingForm onSubmit={handleJobSubmit} />
      ) : (
        <PaymentForm onSuccess={handlePaymentSuccess} />
      )}
    </div>
  )
}
