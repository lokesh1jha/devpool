'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, ChevronDown } from 'lucide-react'
import Image from 'next/image'


export function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Devpool</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink href="/">For Developers</NavLink>
              <NavLink href="/employer">For Employers</NavLink>
              <NavLink href="/jobs">Browse Jobs</NavLink>
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {session ? (
              <>
                <Link href={`/dashboard/${session.user.role}`}>
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={() => signOut()}>Sign out</Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default">Sign up</Button>
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavLink href="/">For Developers</MobileNavLink>
          <MobileNavLink href="/employer">For Employers</MobileNavLink>
          <MobileNavLink href="/jobs">Browse Jobs</MobileNavLink>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          {session ? (
            <div>
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <Image className="h-10 w-10 rounded-full" src={session.user.image || '/placeholder.svg?height=40&width=40'} alt="" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">{session.user.name}</div>
                  <div className="text-sm font-medium text-gray-400">{session.user.email}</div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                <MobileNavLink href={`/dashboard/${session.user.role}`}>Dashboard</MobileNavLink>
                <Button variant="ghost" className="w-full justify-start" onClick={() => signOut()}>Sign out</Button>
              </div>
            </div>
          ) : (
            <div className="mt-3 px-2 space-y-1">
              <MobileNavLink href="/login">Log in</MobileNavLink>
              <MobileNavLink href="/signup">Sign up</MobileNavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
      {children}
    </Link>
  )
}