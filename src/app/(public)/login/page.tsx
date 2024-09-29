'use client'

import { AuthForm } from '@/components/AuthForm'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-4">Log in</h1>
      <AuthForm mode="login" userType="jobseeker" />
    </div>
  )
}