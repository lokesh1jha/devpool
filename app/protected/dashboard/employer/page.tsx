'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data - replace with actual API calls in a real application
const postedJobs = [
  { id: 1, title: "Senior React Developer", applicants: 12, status: "Active" },
  { id: 2, title: "UX Designer", applicants: 8, status: "Active" },
  { id: 3, title: "Product Manager", applicants: 15, status: "Closed" },
]

const applicantData = [
  { name: 'Senior React Developer', applicants: 12 },
  { name: 'UX Designer', applicants: 8 },
  { name: 'Product Manager', applicants: 15 },
]

export default function EmployerDashboard() {
  const [activeJobs, setActiveJobs] = useState(0)
  const [totalApplicants, setTotalApplicants] = useState(0)

 
  useEffect(() => {
    // Calculate active jobs and total applicants
    const active = postedJobs.filter(job => job.status === "Active").length
    const applicants = postedJobs.reduce((sum, job) => sum + job.applicants, 0)
    setActiveJobs(active)
    setTotalApplicants(applicants)
  }, [])


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicants}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Posted Jobs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="jobs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Posted Jobs</h2>
            <Link href="/post-job">
              <Button>Post New Job</Button>
            </Link>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {postedJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>{job.applicants}</TableCell>
                  <TableCell>{job.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Application Analytics</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={applicantData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applicants" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}