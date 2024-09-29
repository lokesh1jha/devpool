'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/AuthForm'
import { Button } from '@/components/ui/button'

export default function SignupPage() {
  const [userType, setUserType] = useState<'jobseeker' | 'employer'>('jobseeker')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-4">Sign up</h1>
      <div className="mb-4">
        <Button
          variant={userType === 'jobseeker' ? 'default' : 'outline'}
          onClick={() => setUserType('jobseeker')}
          className="mr-2"
        >
          Job Seeker
        </Button>
        <Button
          variant={userType === 'employer' ? 'default' : 'outline'}
          onClick={() => setUserType('employer')}
        >
          Employer
        </Button>
      </div>
      <AuthForm mode="signup" userType={userType} />
    </div>
  )
}