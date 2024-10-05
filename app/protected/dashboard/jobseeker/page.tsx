'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - replace with actual API calls in a real application
const appliedJobs = [
  { id: 1, title: "Frontend Developer", company: "Tech Co", status: "Applied" },
  { id: 2, title: "UX Designer", company: "Design Studio", status: "Interview Scheduled" },
  { id: 3, title: "Product Manager", company: "Innovate Inc", status: "Rejected" },
]

const savedJobs = [
  { id: 4, title: "Backend Developer", company: "Server Solutions" },
  { id: 5, title: "Data Analyst", company: "Data Insights" },
]

export default function JobSeekerDashboard() {
  const [appliedCount, setAppliedCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    // Calculate applied and saved jobs
    const applied = appliedJobs.length
    const saved = savedJobs.length
    setAppliedCount(applied)
    setSavedCount(saved)
  }, [])


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Job Seeker Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appliedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applied" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
          <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="applied" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appliedJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="saved" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.company}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="mr-2">View</Button>
                    <Button variant="outline" size="sm">Apply</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  )
}