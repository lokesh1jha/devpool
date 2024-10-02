'use client'
import { useState } from 'react'
import { Search, Briefcase, MapPin, DollarSign, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from 'next/link'
import Image from 'next/image'

// Mock data for featured jobs
const featuredJobs = [
  { id: 1, title: "Senior Software Engineer", company: "TechGiant Inc", location: "San Francisco, CA", salary: "$120,000 - $180,000", logo: "/placeholder.svg?height=80&width=80" },
  { id: 2, title: "Product Manager", company: "Innovate Solutions", location: "New York, NY", salary: "$100,000 - $150,000", logo: "/placeholder.svg?height=80&width=80" },
  { id: 3, title: "UX/UI Designer", company: "Creative Designs", location: "London, UK", salary: "£60,000 - £90,000", logo: "/placeholder.svg?height=80&width=80" },
  { id: 4, title: "Data Scientist", company: "Data Insights Corp", location: "Berlin, Germany", salary: "€80,000 - €120,000", logo: "/placeholder.svg?height=80&width=80" },
  { id: 5, title: "Marketing Specialist", company: "Global Reach", location: "Toronto, Canada", salary: "CAD 70,000 - 100,000", logo: "/placeholder.svg?height=80&width=80" },
]

// Mock data for top companies
const topCompanies = [
  { id: 1, name: "TechGiant Inc", logo: "/placeholder.svg?height=60&width=60" },
  { id: 2, name: "Innovate Solutions", logo: "/placeholder.svg?height=60&width=60" },
  { id: 3, name: "Creative Designs", logo: "/placeholder.svg?height=60&width=60" },
  { id: 4, name: "Data Insights Corp", logo: "/placeholder.svg?height=60&width=60" },
  { id: 5, name: "Global Reach", logo: "/placeholder.svg?height=60&width=60" },
]

export default function Homepage() {
  const [currentJobIndex, setCurrentJobIndex] = useState(0)

  const nextJob = () => {
    setCurrentJobIndex((prevIndex) => (prevIndex + 1) % featuredJobs.length)
  }

  const prevJob = () => {
    setCurrentJobIndex((prevIndex) => (prevIndex - 1 + featuredJobs.length) % featuredJobs.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      {/* <header className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">JobPortal</h1>
            <div className="space-x-4">
              <Button variant="ghost">Find Jobs</Button>
              <Button variant="ghost">For Employers</Button>
              <Button variant="outline">Sign In</Button>
              <Button>Sign Up</Button>
            </div>
          </nav>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">Find Your Dream Job Today</h2>
            <p className="text-xl mb-6">Discover thousands of job opportunities with all the information you need.</p>
          </div>
          <div className="bg-background rounded-lg shadow-lg p-4 flex items-center">
            <Input
              type="text"
              placeholder="Job title, keywords, or company"
              className="flex-grow mr-2"
            />
            <Input
              type="text"
              placeholder="City, state, or zip code"
              className="flex-grow mr-2"
            />
            <Button type="submit" size="lg">
              <Search className="mr-2" />
              Search Jobs
            </Button>
          </div>
        </div>
      </header> */}
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Featured Jobs</h2>
          <div className="relative">
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={featuredJobs[currentJobIndex].logo}
                    alt={featuredJobs[currentJobIndex].company}
                    className="w-16 h-16 mr-4 rounded-full" />
                  <div>
                    <h3 className="text-2xl font-semibold mb-1">{featuredJobs[currentJobIndex].title}</h3>
                    <p className="text-muted-foreground text-lg mb-1">{featuredJobs[currentJobIndex].company}</p>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="mr-4">{featuredJobs[currentJobIndex].location}</span>
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>{featuredJobs[currentJobIndex].salary}</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full">Apply Now</Button>
              </CardContent>
            </Card>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-2 transform -translate-y-1/2"
              onClick={prevJob}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous job</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
              onClick={nextJob}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next job</span>
            </Button>
          </div>
        </section>
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Why Choose JobPortal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Extensive Job Listings</h3>
                <p className="text-muted-foreground">Access thousands of job opportunities across various industries and locations.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Top Companies</h3>
                <p className="text-muted-foreground">Connect with leading companies and startups looking for talent like you.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Salary Insights</h3>
                <p className="text-muted-foreground">Get detailed salary information to help you negotiate better compensation packages.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Top Companies Hiring Now</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {topCompanies.map(company => (
              <Card key={company.id}>
                <CardContent className="p-4 flex flex-col items-center justify-center">
                  <Image src={company.logo} alt={company.name} className="w-12 h-12 mb-2" />
                  <p className="text-center font-semibold">{company.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Opportunity?</h2>
          <p className="text-xl text-muted-foreground mb-6">Join thousands of job seekers who have found their dream jobs through JobPortal.</p>
          <Button size="lg">Create Your Profile</Button>
        </section>
      </main>
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-2">For Job Seekers</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Browse Jobs</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Career Advice</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Resume Builder</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">For Employers</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Post a Job</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Talent Solutions</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Press</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2">Connect With Us</h3>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">Facebook</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-muted-foreground">
            <p>&copy; 2023 Job Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}