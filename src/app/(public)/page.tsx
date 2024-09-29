"use client"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Job Portal</h1>
      <div className="flex space-x-4">
        <Link href="/jobs">
          <Button>Browse Jobs</Button>
        </Link>
        <Link href="/employer">
          <Button variant="outline">For Employers</Button>
        </Link>
      </div>
    </div>
  )
}