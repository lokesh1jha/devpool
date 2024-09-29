import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function EmployerHome() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome Employers</h1>
      <p className="text-xl mb-8">Find the perfect candidates for your company</p>
      <div className="flex space-x-4">
        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Log In</Button>
        </Link>
      </div>
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Why choose our Job Portal?</h2>
        <ul className="list-disc text-left">
          <li>Access to a large pool of qualified candidates</li>
          <li>Easy-to-use job posting interface</li>
          <li>Advanced candidate filtering and matching</li>
          <li>Dedicated support for employers</li>
        </ul>
      </div>
    </div>
  )
}