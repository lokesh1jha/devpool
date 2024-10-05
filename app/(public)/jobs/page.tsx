'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data - replace with actual API call in a real application
const jobListings = [
  { id: 1, title: "Frontend Developer", company: "Tech Co", location: "Remote", salary: "$80,000 - $120,000" },
  { id: 2, title: "UX Designer", company: "Design Studio", location: "New York, NY", salary: "$90,000 - $130,000" },
  { id: 3, title: "Product Manager", company: "Innovate Inc", location: "San Francisco, CA", salary: "$100,000 - $150,000" },
  { id: 4, title: "Data Scientist", company: "Data Insights", location: "Boston, MA", salary: "$110,000 - $160,000" },
  { id: 5, title: "DevOps Engineer", company: "Cloud Systems", location: "Seattle, WA", salary: "$95,000 - $140,000" },
]

export default function JobListings() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')


  const filteredJobs = jobListings.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Job Listings</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredJobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <CardTitle>{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{job.company}</p>
              <p className="text-muted-foreground mb-2">{job.location}</p>
              <p className="font-semibold mb-4">{job.salary}</p>
              <Link href={`/jobs/${job.id}`}>
                <Button>View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}