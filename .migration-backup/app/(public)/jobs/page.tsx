'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data - replace with actual API call in a real application
const jobListings = [
  { id: 1, title: "Frontend Developer", company: "Tech Co", location: "Remote", salary: "$80,000 - $120,000", type: "Full-time" },
  { id: 2, title: "UX Designer", company: "Design Studio", location: "New York, NY", salary: "$90,000 - $130,000", type: "Contract" },
  { id: 3, title: "Product Manager", company: "Innovate Inc", location: "San Francisco, CA", salary: "$100,000 - $150,000", type: "Full-time" },
  { id: 4, title: "Data Scientist", company: "Data Insights", location: "Boston, MA", salary: "$110,000 - $160,000", type: "Part-time" },
  { id: 5, title: "DevOps Engineer", company: "Cloud Systems", location: "Seattle, WA", salary: "$95,000 - $140,000", type: "Full-time" },
]

export default function JobListings() {
  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [jobTypeFilter, setJobTypeFilter] = useState('all')

  const filteredJobs = jobListings.filter(job => 
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (locationFilter === 'all' || job.location.includes(locationFilter)) &&
    (jobTypeFilter === 'all' || job.type === jobTypeFilter)
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Job Listings</h1>
      <div className="mb-6 space-y-4">
        <Input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md w-full bg-white border-gray-300 shadow-sm"
        />
        <div className="flex flex-wrap gap-4">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-[180px] border-white-300 shadow-sm">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="San Francisco">San Francisco</SelectItem>
              <SelectItem value="Boston">Boston</SelectItem>
              <SelectItem value="Seattle">Seattle</SelectItem>
            </SelectContent>
          </Select>
          <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Job Types</SelectItem>
              <SelectItem value="Full-time">Full-time</SelectItem>
              <SelectItem value="Part-time">Part-time</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-20">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="bg-gray-800 border border-gray-700">
            <CardHeader>
              <CardTitle className="text-blue-600">{job.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-2">{job.company}</p>
              <p className="text-white mb-2">{job.location}</p>
              <p className="text-white mb-2">{job.type}</p>
              <p className="font-semibold mb-4 text-gray-800">{job.salary}</p>
              <Link href={`/jobs/${job.id}`}>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white w-full">View Details</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
