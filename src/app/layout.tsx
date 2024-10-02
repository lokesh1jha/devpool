'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/Navbar'
import { SessionProvider } from 'next-auth/react'
import ProgressBar from '@/components/ProgressBar'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ProgressBar />
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}