'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Briefcase, Users, Filter, BarChart, Globe, DollarSign } from 'lucide-react'

export default function EmployerHome() {
  const [email, setEmail] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('Standard')

  const features = [
    { icon: Users, title: 'Large Talent Pool', description: 'Access thousands of qualified tech professionals.' },
    { icon: Filter, title: 'Advanced Filtering', description: 'Find the perfect match with our smart algorithms.' },
    { icon: Briefcase, title: 'Easy Job Posting', description: 'Post jobs in minutes with our user-friendly interface.' },
    { icon: Briefcase, title: 'Resume Access', description: 'Access resumes from qualified tech professionals.' },
    { icon: BarChart, title: 'Analytics Dashboard', description: 'Track your job postings and candidate interactions.' },
    { icon: Globe, title: 'Global Reach', description: 'Connect with talent from around the world.' },
  ]

  const pricingPlans = [
    { name: 'Basic', price: '$150', features: ['1 Job Post', '30 Days Visibility'] },
    { name: 'Standard', price: '$400', features: ['3 Job Posts', '60 Days Visibility', 'Basic Analytics', 'Resume access'] },
    { name: 'Premium', price: '$750', features: ['5 Job Posts', 'Featured Listing', 'Advanced Analytics', 'Resume access', 'Priority Support'] },
  ]

  const hiringProcess = [
    { 
      title: 'Post a Job', 
      description: 'Easily create and publish your job listing with our user-friendly interface.',
      image: '/placeholder.svg?height=200&width=300'
    },
    { 
      title: 'Review Candidates', 
      description: 'Browse through qualified applicants and use our advanced filtering tools to find the best matches.',
      image: '/placeholder.svg?height=200&width=300'
    },
    { 
      title: 'Interview', 
      description: 'Conduct interviews with your top candidates using our integrated video conferencing tools.',
      image: '/placeholder.svg?height=200&width=300'
    },
    { 
      title: 'Hire', 
      description: 'Make your final selection and use our onboarding tools to seamlessly bring your new hire into the team.',
      image: '/placeholder.svg?height=200&width=300'
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Hire Top Tech Talent with Devpool
          </motion.h1>
          <motion.p 
            className="text-xl mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Connect with the best developers and tech professionals for your company
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/protected/dashboard/employer">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">Get Started</Button>
            </Link>
            {/* <Link href="/employer/login">
              <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-purple-600">
                Log In
              </Button>
            </Link> */}
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Devpool for Hiring?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300 border-gray-700 h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <feature.icon className="w-12 h-12 mb-4 text-blue-500" />
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Hiring Process</h2>
          <div className="flex flex-col items-center">
            {hiringProcess.map((step, index) => (
              <motion.div
                key={index}
                className={`flex flex-col md:flex-row items-center mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={`w-full md:w-1/2 mb-4 md:mb-0 ${index % 2 === 0 ? 'md:pl-8' : 'md:pr-8'}`}>
                  <Image
                    src={step.image}
                    alt={step.title}
                    width={300}
                    height={200}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-2">{index + 1}. {step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Pricing Plans</h2>
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className="flex-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card 
                  className={`bg-gray-800 hover:bg-gray-700 transition-colors duration-300 border-2 h-full flex flex-col cursor-pointer ${
                    selectedPlan === plan.name 
                      ? 'border-blue-500' 
                      : 'border-gray-700'
                  }`}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  <CardContent className="p-6 flex flex-col flex-grow">
                    {plan.name === 'Standard' && (
                      <div className="bg-blue-500 text-white text-sm font-bold uppercase py-1 px-3 rounded-full mb-4 self-start">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                    <p className="text-4xl font-bold mb-6">{plan.price}<span className="text-xl font-normal">/month</span></p>
                    <ul className="space-y-2 mb-6 flex-grow">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${
                        selectedPlan === plan.name 
                          ? 'bg-blue-500 hover:bg-blue-600' 
                          : 'bg-gray-600 hover:bg-gray-500'
                      } text-white mt-auto`}
                    >
                      {selectedPlan === plan.name ? 'Selected' : 'Choose Plan'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Star Employee?</h2>
              <p className="text-xl mb-8">Join thousands of companies who have found their perfect tech talent through Devpool</p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-xs bg-white text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">Get Started</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">What Employers Say About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'John Doe', role: 'CTO at TechCorp', content: 'Devpool has revolutionized our hiring process. We\'ve found amazing talent in record time.' },
              { name: 'Jane Smith', role: 'HR Manager at InnovateSoft', content: 'The quality of candidates on Devpool is unmatched. It\'s our go-to platform for all tech hires.' }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300 border-gray-700">
                  <CardContent className="p-6">
                    <p className="text-lg mb-4 text-gray-300">&quot;{testimonial.content}&quot;</p>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-gray-400">{testimonial.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

    </div>
  )
}