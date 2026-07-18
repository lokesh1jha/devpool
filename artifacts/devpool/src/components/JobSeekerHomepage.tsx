import { useState, useEffect } from 'react';
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Code,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

const featuredJobs = [
  { id: 1, title: 'Senior Full Stack Developer', company: 'TechGiant Inc', location: 'San Francisco, CA', salary: '$120,000 - $180,000', logo: '/placeholder.svg' },
  { id: 2, title: 'AI/ML Engineer', company: 'Innovate Solutions', location: 'New York, NY', salary: '$130,000 - $200,000', logo: '/placeholder.svg' },
  { id: 3, title: 'DevOps Specialist', company: 'Cloud Dynamics', location: 'London, UK', salary: '£70,000 - £110,000', logo: '/placeholder.svg' },
  { id: 4, title: 'Blockchain Developer', company: 'Crypto Innovations', location: 'Berlin, Germany', salary: '€90,000 - €140,000', logo: '/placeholder.svg' },
  { id: 5, title: 'Mobile App Developer', company: 'AppMasters', location: 'Toronto, Canada', salary: 'CAD 80,000 - 120,000', logo: '/placeholder.svg' },
];

const jobListings = [
  { id: 1, title: 'Frontend Developer', company: 'WebCraft', location: 'Remote', type: 'Full-time' },
  { id: 2, title: 'Backend Engineer', company: 'DataFlow', location: 'New York, NY', type: 'Full-time' },
  { id: 3, title: 'UI/UX Designer', company: 'DesignPro', location: 'San Francisco, CA', type: 'Contract' },
  { id: 4, title: 'Data Scientist', company: 'AI Insights', location: 'Boston, MA', type: 'Full-time' },
];

const testimonials = [
  { id: 1, name: 'Alex Johnson', role: 'Senior Developer', company: 'TechGiant Inc', content: 'Devpool helped me land my dream job within weeks! The platform is intuitive and has a fantastic selection of tech jobs.' },
  { id: 2, name: 'Maria Garcia', role: 'Full Stack Engineer', company: 'Innovate Solutions', content: "I was impressed by the quality of job listings on Devpool. It's tailored perfectly for developers like me." },
  { id: 3, name: 'Raj Patel', role: 'DevOps Engineer', company: 'Cloud Dynamics', content: "Devpool's community features helped me connect with other professionals and stay updated with the latest in tech." },
];

export default function JobSeekerHomepage() {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [, navigate] = useLocation();

  const nextJob = () => setCurrentJobIndex((prev) => (prev + 1) % featuredJobs.length);
  const prevJob = () => setCurrentJobIndex((prev) => (prev - 1 + featuredJobs.length) % featuredJobs.length);

  const handleJobClick = (id: number) => navigate(`/jobs/${id}`);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Find Your Dream Tech Job
            </motion.h1>
            <motion.p
              className="text-xl mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Connect with top tech companies and startups worldwide
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/jobs">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                  <Briefcase className="mr-2" />
                  Browse Jobs
                </Button>
              </Link>
            </motion.div>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex items-center">
            <Input
              type="text"
              placeholder="Job title, keywords, or company"
              className="flex-1 mr-4 bg-gray-700 text-white border-gray-600"
            />
            <Input
              type="text"
              placeholder="Location"
              className="flex-1 mr-4 bg-gray-700 text-white border-gray-600"
            />
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              <Search className="mr-2" />
              Search
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Featured Jobs Carousel */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Featured Jobs</h2>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentJobIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gray-800 border border-gray-700">
                  <CardContent className="px-20 py-6">
                    <div className="flex items-center mb-4 flex-col sm:flex-row">
                      <img
                        src={featuredJobs[currentJobIndex].logo}
                        alt={featuredJobs[currentJobIndex].company}
                        width={80}
                        height={80}
                        className="rounded-full mr-4 bg-gray-700"
                      />
                      <div>
                        <h3 className="text-2xl font-semibold mb-1 text-white text-center sm:text-start">
                          {featuredJobs[currentJobIndex].title}
                        </h3>
                        <p className="text-gray-400 text-lg mb-1 text-center sm:text-start">
                          {featuredJobs[currentJobIndex].company}
                        </p>
                        <div className="flex items-center text-gray-400 flex-col sm:flex-row">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="mr-4">{featuredJobs[currentJobIndex].location}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>{featuredJobs[currentJobIndex].salary}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white hover:bg-gray-600"
              onClick={prevJob}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous job</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white hover:bg-gray-600"
              onClick={nextJob}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next job</span>
            </Button>
          </div>
        </section>

        {/* Why Choose Devpool */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Why Choose Devpool?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border border-gray-700">
              <CardContent className="p-6 text-center">
                <Code className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold mb-2 text-white">Tailored for Developers</h3>
                <p className="text-gray-400">
                  Curated job listings specifically for software developers and tech professionals.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border border-gray-700">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2 text-white">Community-Driven</h3>
                <p className="text-gray-400">
                  Connect with fellow developers, share insights, and grow your professional network.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border border-gray-700">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <h3 className="text-xl font-semibold mb-2 text-white">Career Acceleration</h3>
                <p className="text-gray-400">
                  Access resources, mentorship opportunities, and skill-building workshops.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Latest Job Opportunities */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">Latest Job Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {jobListings.map((job) => (
              <Card
                key={job.id}
                className="bg-gray-800 border border-gray-700 transition-all duration-300 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleJobClick(job.id)}
              >
                <CardContent className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">{job.title}</h3>
                  <p className="text-gray-400 mb-2">{job.company}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/jobs">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                See All Jobs
              </Button>
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center text-white">What Our Users Say</h2>
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonialIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-gray-800 border border-gray-700">
                  <CardContent className="p-6 text-center">
                    <p className="text-xl mb-4 text-white">
                      &quot;{testimonials[currentTestimonialIndex].content}&quot;
                    </p>
                    <p className="font-semibold text-white">{testimonials[currentTestimonialIndex].name}</p>
                    <p className="text-gray-400">
                      {testimonials[currentTestimonialIndex].role} at {testimonials[currentTestimonialIndex].company}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Elevate Your Tech Career?</h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of developers who have found their perfect roles through Devpool.
          </p>
          <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
            Create Your Profile
          </Button>
        </section>
      </main>
    </div>
  );
}
