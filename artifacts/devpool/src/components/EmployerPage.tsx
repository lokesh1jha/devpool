import { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Briefcase, Users, Filter, BarChart, Globe } from 'lucide-react';

export default function EmployerHome() {
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Standard');

  const features = [
    { icon: Users, title: 'Large Talent Pool', description: 'Access thousands of qualified tech professionals.' },
    { icon: Filter, title: 'Advanced Filtering', description: 'Find the perfect match with our smart algorithms.' },
    { icon: Briefcase, title: 'Easy Job Posting', description: 'Post jobs in minutes with our user-friendly interface.' },
    { icon: Briefcase, title: 'Resume Access', description: 'Access resumes from qualified tech professionals.' },
    { icon: BarChart, title: 'Analytics Dashboard', description: 'Track your job postings and candidate interactions.' },
    { icon: Globe, title: 'Global Reach', description: 'Connect with talent from around the world.' },
  ];

  const pricingPlans = [
    { name: 'Basic', price: '$150', features: ['1 Job Post', '30 Days Visibility'] },
    { name: 'Standard', price: '$400', features: ['3 Job Posts', '60 Days Visibility', 'Basic Analytics', 'Resume access'] },
    { name: 'Premium', price: '$750', features: ['5 Job Posts', 'Featured Listing', 'Advanced Analytics', 'Resume access', 'Priority Support'] },
  ];

  const hiringProcess = [
    { title: 'Post a Job', description: 'Easily create and publish your job listing with our user-friendly interface.', image: '/placeholder.svg' },
    { title: 'Review Candidates', description: 'Browse through qualified applicants and use our advanced filtering tools to find the best matches.', image: '/placeholder.svg' },
    { title: 'Interview', description: 'Conduct interviews with your top candidates using our integrated video conferencing tools.', image: '/placeholder.svg' },
    { title: 'Hire', description: 'Make your final selection and use our onboarding tools to seamlessly bring your new hire into the team.', image: '/placeholder.svg' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero */}
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
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                Post a Job
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Browse Talent
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        {/* Features */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Devpool?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors duration-300">
                  <CardContent className="p-6">
                    <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Hiring Process */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Hiring Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hiringProcess.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <img src={step.image} alt={step.title} width={300} height={200} className="w-full rounded-md bg-gray-700" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Transparent Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan.name
                      ? 'bg-blue-700 border-blue-500'
                      : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                    <p className="text-4xl font-bold text-blue-400 mb-4">{plan.price}</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white">
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-20">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Star Employee?</h2>
              <p className="text-xl mb-8">
                Join thousands of companies who have found their perfect tech talent through Devpool
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-xs bg-white text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                  Get Started
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">What Employers Say About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'John Doe', role: 'CTO at TechCorp', content: "Devpool has revolutionized our hiring process. We've found amazing talent in record time." },
              { name: 'Jane Smith', role: 'HR Manager at InnovateSoft', content: "The quality of candidates on Devpool is unmatched. It's our go-to platform for all tech hires." },
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
  );
}
